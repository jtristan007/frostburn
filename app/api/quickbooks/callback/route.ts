import { NextResponse } from 'next/server'
import { connectAccount } from '@/lib/quickbooks/client'
import { getCurrentAccount } from '@/lib/account'

// state carries the account_id set by connectQuickBooks() (app/actions/
// quickbooks.ts) when it kicked off the OAuth flow. Checked against the
// still-live Frostburn session below so a crafted callback URL can't
// attach someone else's QuickBooks company to this account.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const realmId = searchParams.get('realmId')
  const accountId = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?error=${encodeURIComponent(error)}`)
  }

  if (!code || !realmId || !accountId) {
    return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?error=Missing+callback+parameters`)
  }

  const { account } = await getCurrentAccount()
  if (account.id !== accountId) {
    return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?error=Session+mismatch`)
  }

  try {
    await connectAccount(accountId, code, realmId)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not connect QuickBooks'
    return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?error=${encodeURIComponent(message)}`)
  }

  return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?connected=1`)
}
