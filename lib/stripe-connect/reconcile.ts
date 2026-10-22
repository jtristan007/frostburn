import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'

// Backup for the Connect webhook: asks Stripe directly whether the invoice's
// Checkout Session was paid, and marks the invoice paid if so. Called when
// the customer lands back on the pay page and when the owner opens the
// invoice, so a missed or misconfigured webhook can't leave a paid invoice
// looking unpaid (and keep sending overdue reminders). Returns true when the
// invoice is paid. Never throws.
export async function reconcileInvoicePayment(invoiceId: string): Promise<boolean> {
  const admin = createAdminClient()
  const { data: invoice } = await admin
    .from('invoices')
    .select('id, status, account_id, stripe_checkout_session_id')
    .eq('id', invoiceId)
    .maybeSingle()

  if (!invoice) return false
  if (invoice.status === 'paid') return true
  if (!invoice.stripe_checkout_session_id) return false

  const { data: account } = await admin
    .from('accounts')
    .select('stripe_connect_account_id')
    .eq('id', invoice.account_id)
    .maybeSingle()
  if (!account?.stripe_connect_account_id) return false

  try {
    const session = await stripe.checkout.sessions.retrieve(invoice.stripe_checkout_session_id, undefined, {
      stripeAccount: account.stripe_connect_account_id,
    })
    if (session.payment_status !== 'paid' || session.metadata?.invoice_id !== invoice.id) return false

    await admin
      .from('invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      })
      .eq('id', invoice.id)
    return true
  } catch (err) {
    console.error('reconcileInvoicePayment failed:', err)
    return false
  }
}
