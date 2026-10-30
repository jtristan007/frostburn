'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { countryOf } from '@/lib/money'

// Public route (/portal/[token]) has no session, so -- same as
// getQuoteByToken and getInvoiceByToken -- this fetches via the
// service-role client by token instead of relying on RLS. The token itself
// is the capability; only display-safe columns are selected.
export async function getPortalByToken(token: string) {
  const admin = createAdminClient()
  const { data: customer } = await admin
    .from('customers')
    .select('id, name, account_id')
    .eq('portal_token', token)
    .maybeSingle()

  if (!customer) return null

  const [{ data: account }, { data: invoices }, { data: quotes }, { data: equipment }] = await Promise.all([
    admin
      .from('accounts')
      // '*' so this keeps working before migration 0017 adds `country`.
      .select('*')
      .eq('id', customer.account_id)
      .maybeSingle(),
    admin
      .from('invoices')
      .select('id, invoice_number, status, total, due_date, pay_token')
      .eq('customer_id', customer.id)
      // Drafts aren't the customer's business until they're sent.
      .neq('status', 'draft')
      .order('issue_date', { ascending: false }),
    admin
      .from('quotes')
      .select('id, status, total, created_at, share_token')
      .eq('customer_id', customer.id)
      .neq('status', 'draft')
      .order('created_at', { ascending: false }),
    admin
      .from('equipment')
      .select('id, unit_type, model, install_date')
      .eq('customer_id', customer.id),
  ])

  return {
    customer,
    companyName: account?.name ?? null,
    chargesEnabled: !!account?.stripe_connect_charges_enabled,
    country: countryOf(account),
    invoices: invoices ?? [],
    quotes: quotes ?? [],
    equipment: equipment ?? [],
  }
}
