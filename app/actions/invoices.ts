'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe/client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

function readInvoiceFields(formData: FormData) {
  return {
    customer_id: formData.get('customer_id') as string,
    job_id: (formData.get('job_id') as string) || null,
    invoice_number: formData.get('invoice_number') as string,
    status: formData.get('status') as string,
    issue_date: formData.get('issue_date') as string,
    due_date: (formData.get('due_date') as string) || null,
    total: Number(formData.get('total')),
  }
}

export async function createInvoice(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('invoices').insert(readInvoiceFields(formData))
  if (error) throw new Error(error.message)
  redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('invoices').update(readInvoiceFields(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  redirect('/dashboard/invoices')
}

export async function markInvoicePaid(id: string) {
  const supabase = await createClient()
  await supabase.from('invoices').update({ status: 'paid' }).eq('id', id)
  revalidatePath('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()
  await supabase.from('invoices').delete().eq('id', id)
  redirect('/dashboard/invoices')
}

// Unauthenticated lookup for the public /pay/[token] page -- same shape as
// quotes' getQuoteByToken: service-role client, no RLS involved, selects
// only display-safe columns. Pulls in the HVAC company's own Stripe Connect
// status so the pay page can tell "already paid" apart from "this company
// hasn't turned on online payment yet".
export async function getInvoiceByToken(token: string) {
  const admin = createAdminClient()
  const { data: invoice } = await admin
    .from('invoices')
    .select('id, invoice_number, status, total, account_id, customer_id')
    .eq('pay_token', token)
    .maybeSingle()

  if (!invoice) return null

  const [{ data: account }, { data: customer }] = await Promise.all([
    admin
      .from('accounts')
      .select('name, stripe_connect_account_id, stripe_connect_charges_enabled')
      .eq('id', invoice.account_id)
      .maybeSingle(),
    admin.from('customers').select('name').eq('id', invoice.customer_id).maybeSingle(),
  ])

  return { invoice, companyName: account?.name ?? null, customerName: customer?.name ?? null, chargesEnabled: !!account?.stripe_connect_charges_enabled }
}

// Creates a Checkout Session as a direct charge on the HVAC company's own
// connected Stripe account (the `stripeAccount` request option), so the
// connected account is the merchant of record and receives the funds
// directly -- Frostburn takes no application fee. Bound as a public pay-page
// form action (same shape as connectQuickBooks/disconnectQuickBooks): it
// re-reads the invoice and connected-account status itself rather than
// trusting the caller, and redirects either to Stripe or back to the pay
// page with an error to display.
export async function payInvoice(token: string) {
  const admin = createAdminClient()
  const { data: invoice } = await admin
    .from('invoices')
    .select('id, invoice_number, status, total, account_id')
    .eq('pay_token', token)
    .maybeSingle()

  if (!invoice) redirect(`/pay/${token}?error=${encodeURIComponent('Invoice not found.')}`)
  if (invoice.status === 'paid') redirect(`/pay/${token}`)

  const { data: account } = await admin
    .from('accounts')
    .select('stripe_connect_account_id, stripe_connect_charges_enabled')
    .eq('id', invoice.account_id)
    .maybeSingle()

  if (!account?.stripe_connect_account_id || !account.stripe_connect_charges_enabled) {
    redirect(`/pay/${token}?error=${encodeURIComponent('Online payment is not available for this invoice yet.')}`)
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(Number(invoice.total) * 100),
            product_data: { name: `Invoice ${invoice.invoice_number}` },
          },
          quantity: 1,
        },
      ],
      metadata: { invoice_id: invoice.id },
      success_url: `${siteUrl}/pay/${token}?paid=1`,
      cancel_url: `${siteUrl}/pay/${token}`,
    },
    { stripeAccount: account.stripe_connect_account_id }
  )

  if (!session.url) redirect(`/pay/${token}?error=${encodeURIComponent('Stripe did not return a payment URL.')}`)

  await admin.from('invoices').update({ stripe_checkout_session_id: session.id }).eq('id', invoice.id)

  redirect(session.url)
}
