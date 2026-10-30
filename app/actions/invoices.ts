'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe/client'
import { getCurrentAccount } from '@/lib/account'
import { sendInvoiceEmail } from '@/lib/resend/emails'
import { countryOf, currencyFor } from '@/lib/money'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

type FormState = { error?: string } | undefined

function readInvoiceFields(formData: FormData) {
  return {
    customer_id: formData.get('customer_id') as string,
    job_id: (formData.get('job_id') as string) || null,
    invoice_number: ((formData.get('invoice_number') as string) ?? '').trim(),
    status: formData.get('status') as string,
    issue_date: formData.get('issue_date') as string,
    due_date: (formData.get('due_date') as string) || null,
    total: Number(formData.get('total')),
  }
}

function validateInvoice(fields: ReturnType<typeof readInvoiceFields>): string | null {
  if (!fields.customer_id) return 'Choose a customer for this invoice.'
  if (!fields.invoice_number) return 'Enter an invoice number.'
  if (!Number.isFinite(fields.total) || fields.total < 0) return 'Enter a total of $0 or more.'
  return null
}

// Turns a database error into something the owner can act on. The only
// constraint they can realistically hit from the form is the per-account
// unique invoice number.
function saveError(error: { code?: string; message: string }, invoiceNumber: string) {
  if (error.code === '23505') {
    return `Invoice number ${invoiceNumber} is already used. Pick a different number.`
  }
  console.error('Saving invoice failed:', error)
  return 'The invoice could not be saved. Please try again.'
}

// A new invoice starts as a draft (or as already paid, for recording a cash
// or check payment). "Sent" is only ever set by actually emailing it --
// letting the owner pick "Sent" here showed "Sent ✓" for invoices that
// never went out. Lands on the invoice page, where the Send button is.
// Returns { error } for the form to show instead of throwing.
export async function createInvoice(_prev: FormState, formData: FormData): Promise<FormState> {
  const fields = readInvoiceFields(formData)
  const invalid = validateInvoice(fields)
  if (invalid) return { error: invalid }

  const supabase = await createClient()
  const status = fields.status === 'paid' ? 'paid' : 'draft'
  const { data, error } = await supabase
    .from('invoices')
    .insert({ ...fields, status, paid_at: status === 'paid' ? new Date().toISOString() : null })
    .select('id')
    .single()
  if (error || !data) return { error: error ? saveError(error, fields.invoice_number) : 'The invoice could not be saved. Please try again.' }
  redirect(`/dashboard/invoices/${data.id}`)
}

export async function updateInvoice(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const fields = readInvoiceFields(formData)
  const invalid = validateInvoice(fields)
  if (invalid) return { error: invalid }

  const supabase = await createClient()
  const { error } = await supabase.from('invoices').update(fields).eq('id', id)
  if (error) return { error: saveError(error, fields.invoice_number) }
  redirect('/dashboard/invoices')
}

export async function markInvoicePaid(id: string) {
  const supabase = await createClient()
  await supabase.from('invoices').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id)
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
      // '*' rather than a column list so this keeps working if the code
      // ships before migration 0017 adds `country` (countryOf -> US).
      .select('*')
      .eq('id', invoice.account_id)
      .maybeSingle(),
    admin.from('customers').select('name').eq('id', invoice.customer_id).maybeSingle(),
  ])

  return {
    invoice,
    companyName: account?.name ?? null,
    customerName: customer?.name ?? null,
    chargesEnabled: !!account?.stripe_connect_charges_enabled,
    country: countryOf(account),
  }
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
    .select('*')
    .eq('id', invoice.account_id)
    .maybeSingle()

  if (!account?.stripe_connect_account_id || !account.stripe_connect_charges_enabled) {
    redirect(`/pay/${token}?error=${encodeURIComponent('Online payment is not available for this invoice yet.')}`)
  }

  const amount = Math.round(Number(invoice.total) * 100)
  if (!(amount >= 50)) {
    redirect(`/pay/${token}?error=${encodeURIComponent('This invoice amount can’t be paid online. Please contact the company directly.')}`)
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>
  try {
    session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: currencyFor(countryOf(account)),
              unit_amount: amount,
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
  } catch (err) {
    console.error('Invoice Checkout session creation failed:', err)
    redirect(`/pay/${token}?error=${encodeURIComponent('Online payment is temporarily unavailable. Please try again in a few minutes.')}`)
  }

  if (!session.url) redirect(`/pay/${token}?error=${encodeURIComponent('Stripe did not return a payment URL.')}`)

  await admin.from('invoices').update({ stripe_checkout_session_id: session.id }).eq('id', invoice.id)

  redirect(session.url)
}

// Emails the invoice to its customer. Reads through the caller's RLS-scoped
// client, so an owner can only send their own account's invoices. Includes
// the pay link only when the account can take card payments; a draft
// becomes "sent" once the email goes out.
export async function sendInvoiceToCustomer(id: string): Promise<{ error?: string; sentTo?: string }> {
  const { supabase, user, account } = await getCurrentAccount()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('id, invoice_number, status, total, due_date, pay_token, customers(name, email)')
    .eq('id', id)
    .maybeSingle()

  if (!invoice) return { error: 'Invoice not found.' }
  if (invoice.status === 'paid') return { error: 'This invoice is already paid.' }

  const customer = invoice.customers as unknown as { name: string; email: string | null } | null
  if (!customer?.email) return { error: 'Add an email address to this customer first.' }

  const ok = await sendInvoiceEmail({
    to: customer.email,
    replyTo: user.email ?? undefined,
    customerName: customer.name,
    companyName: account.name,
    invoiceNumber: invoice.invoice_number,
    total: Number(invoice.total),
    dueDate: invoice.due_date,
    payUrl: account.stripe_connect_charges_enabled ? `${siteUrl}/pay/${invoice.pay_token}` : null,
    country: countryOf(account),
  })
  if (!ok) return { error: 'The email could not be sent. Please try again in a minute.' }

  if (invoice.status === 'draft') {
    await supabase.from('invoices').update({ status: 'sent' }).eq('id', id)
  }
  revalidatePath(`/dashboard/invoices/${id}`)
  revalidatePath('/dashboard/invoices')
  return { sentTo: customer.email }
}
