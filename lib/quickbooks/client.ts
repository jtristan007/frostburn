import { createAdminClient } from '@/lib/supabase/admin'

const IS_SANDBOX = process.env.QUICKBOOKS_ENVIRONMENT !== 'production'

const AUTHORIZE_URL = 'https://appcenter.intuit.com/connect/oauth2'
const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
const API_BASE = IS_SANDBOX
  ? 'https://sandbox-quickbooks.api.intuit.com'
  : 'https://quickbooks.api.intuit.com'

const SCOPE = 'com.intuit.quickbooks.accounting'

function basicAuthHeader() {
  const id = process.env.QUICKBOOKS_CLIENT_ID!
  const secret = process.env.QUICKBOOKS_CLIENT_SECRET!
  return 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64')
}

function redirectUri() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return `${siteUrl}/api/quickbooks/callback`
}

// state carries the account_id through Intuit's redirect so the callback
// knows which Frostburn account to attach the connection to.
export function getAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.QUICKBOOKS_CLIENT_ID!,
    response_type: 'code',
    scope: SCOPE,
    redirect_uri: redirectUri(),
    state,
  })
  return `${AUTHORIZE_URL}?${params.toString()}`
}

type TokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  x_refresh_token_expires_in: number
}

async function requestTokens(body: URLSearchParams): Promise<TokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`QuickBooks token request failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function connectAccount(accountId: string, code: string, realmId: string): Promise<void> {
  const tokens = await requestTokens(
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(),
    })
  )

  const now = Date.now()
  const admin = createAdminClient()
  const { error } = await admin.from('quickbooks_connections').upsert(
    {
      account_id: accountId,
      realm_id: realmId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      access_token_expires_at: new Date(now + tokens.expires_in * 1000).toISOString(),
      refresh_token_expires_at: new Date(now + tokens.x_refresh_token_expires_in * 1000).toISOString(),
    },
    { onConflict: 'account_id' }
  )
  if (error) throw new Error(error.message)
}

export async function disconnectAccount(accountId: string): Promise<void> {
  const admin = createAdminClient()
  await admin.from('quickbooks_connections').delete().eq('account_id', accountId)
}

export async function getConnectionStatus(accountId: string): Promise<{ connected: boolean; realmId?: string }> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('quickbooks_connections')
    .select('realm_id')
    .eq('account_id', accountId)
    .maybeSingle()
  return data ? { connected: true, realmId: data.realm_id } : { connected: false }
}

// Refreshes the access token if it's within 5 minutes of expiring. Returns
// a ready-to-use {accessToken, realmId} pair for API calls.
async function getValidAccessToken(accountId: string): Promise<{ accessToken: string; realmId: string }> {
  const admin = createAdminClient()
  const { data: conn } = await admin
    .from('quickbooks_connections')
    .select('*')
    .eq('account_id', accountId)
    .maybeSingle()

  if (!conn) throw new Error('QuickBooks is not connected for this account.')

  const expiresSoon = new Date(conn.access_token_expires_at).getTime() - Date.now() < 5 * 60 * 1000
  if (!expiresSoon) return { accessToken: conn.access_token, realmId: conn.realm_id }

  const tokens = await requestTokens(
    new URLSearchParams({ grant_type: 'refresh_token', refresh_token: conn.refresh_token })
  )
  const now = Date.now()
  await admin
    .from('quickbooks_connections')
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      access_token_expires_at: new Date(now + tokens.expires_in * 1000).toISOString(),
      refresh_token_expires_at: new Date(now + tokens.x_refresh_token_expires_in * 1000).toISOString(),
    })
    .eq('account_id', accountId)

  return { accessToken: tokens.access_token, realmId: conn.realm_id }
}

async function qbFetch(accountId: string, path: string, init?: RequestInit) {
  const { accessToken, realmId } = await getValidAccessToken(accountId)
  const res = await fetch(`${API_BASE}/v3/company/${realmId}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`QuickBooks API error (${res.status}) on ${path}: ${text}`)
  }
  return res.json()
}

async function findCustomerByName(accountId: string, name: string): Promise<string | null> {
  const escaped = name.replace(/'/g, "\\'")
  const query = `select Id from Customer where DisplayName = '${escaped}'`
  const data = await qbFetch(accountId, `query?query=${encodeURIComponent(query)}`)
  return data.QueryResponse?.Customer?.[0]?.Id ?? null
}

async function createCustomer(accountId: string, name: string): Promise<string> {
  const data = await qbFetch(accountId, 'customer', {
    method: 'POST',
    body: JSON.stringify({ DisplayName: name }),
  })
  return data.Customer.Id
}

async function findOrCreateCustomer(accountId: string, name: string): Promise<string> {
  const existing = await findCustomerByName(accountId, name)
  if (existing) return existing
  return createCustomer(accountId, name)
}

// QuickBooks invoice lines must reference an Item -- there's no way to bill
// a bare amount. Frostburn doesn't map its pricing-book items to QuickBooks
// items, so every invoice is pushed as one line against a single generic
// service item, created once per company and reused after that.
const GENERIC_ITEM_NAME = 'Frostburn Services'

async function findOrCreateServiceItemId(accountId: string): Promise<string> {
  const query = `select Id from Item where Name = '${GENERIC_ITEM_NAME}'`
  const data = await qbFetch(accountId, `query?query=${encodeURIComponent(query)}`)
  const existing = data.QueryResponse?.Item?.[0]?.Id
  if (existing) return existing

  const created = await qbFetch(accountId, 'item', {
    method: 'POST',
    body: JSON.stringify({
      Name: GENERIC_ITEM_NAME,
      Type: 'Service',
      IncomeAccountRef: await findIncomeAccountRef(accountId),
    }),
  })
  return created.Item.Id
}

async function findIncomeAccountRef(accountId: string): Promise<{ value: string }> {
  const query = `select Id from Account where AccountType = 'Income' maxresults 1`
  const data = await qbFetch(accountId, `query?query=${encodeURIComponent(query)}`)
  const id = data.QueryResponse?.Account?.[0]?.Id
  if (!id) throw new Error('No QuickBooks income account found to attach the service item to.')
  return { value: id }
}

export async function pushInvoice(
  accountId: string,
  invoice: { invoice_number: string; total: number; customerName: string }
): Promise<string> {
  const [customerId, itemId] = await Promise.all([
    findOrCreateCustomer(accountId, invoice.customerName),
    findOrCreateServiceItemId(accountId),
  ])

  const data = await qbFetch(accountId, 'invoice', {
    method: 'POST',
    body: JSON.stringify({
      CustomerRef: { value: customerId },
      DocNumber: invoice.invoice_number,
      Line: [
        {
          Amount: invoice.total,
          DetailType: 'SalesItemLineDetail',
          Description: `Frostburn invoice ${invoice.invoice_number}`,
          SalesItemLineDetail: { ItemRef: { value: itemId } },
        },
      ],
    }),
  })

  return data.Invoice.Id
}
