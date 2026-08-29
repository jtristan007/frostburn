'use server'

import { createAdminClient } from '@/lib/supabase/admin'

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
      .select('name, stripe_connect_charges_enabled')
      .eq('id', customer.account_id)
      .maybeSingle(),
    admin
      .from('invoices')
      .select('id, invoice_number, status, total, due_date, pay_token')
      .eq('customer_id', customer.id)
      .order('issue_date', { ascending: false }),
    admin
      .from('quotes')
      .select('id, status, total, created_at, share_token')
      .eq('customer_id', customer.id)
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
    invoices: invoices ?? [],
    quotes: quotes ?? [],
    equipment: equipment ?? [],
  }
}
