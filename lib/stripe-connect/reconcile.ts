import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'

// Backup for the Connect webhook: asks Stripe directly whether the invoice's
// Checkout Session was paid, and marks the invoice paid if so. Called when
// the customer lands back on the pay page, when the owner opens the
// invoice, and for every started-but-unpaid invoice in the daily cron
// (reconcileOpenCheckouts), so a missed or misconfigured webhook can't leave
// a paid invoice looking unpaid (and keep sending overdue reminders).
// Returns true when the invoice is paid. Never throws.
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

const MAX_CRON_CHECKS = 200
const CONCURRENCY = 10

// Daily sweep for the cron: every unpaid invoice whose customer opened
// Stripe Checkout gets checked once. Runs before overdue reminders so a
// customer who already paid never gets one. Bounded per run; never throws.
export async function reconcileOpenCheckouts(): Promise<number> {
  const admin = createAdminClient()
  const { data: open } = await admin
    .from('invoices')
    .select('id')
    .in('status', ['draft', 'sent', 'overdue'])
    .not('stripe_checkout_session_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(MAX_CRON_CHECKS)

  const ids = (open ?? []).map((i) => i.id)
  let marked = 0
  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const results = await Promise.all(ids.slice(i, i + CONCURRENCY).map((id) => reconcileInvoicePayment(id)))
    marked += results.filter(Boolean).length
  }
  return marked
}
