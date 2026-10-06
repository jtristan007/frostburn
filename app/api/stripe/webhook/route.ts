import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { tierForPriceId, type Tier } from '@/lib/stripe/plans'
import { sendPaymentFailedEmail } from '@/lib/resend/emails'

const DUNNING_STATUSES = new Set(['past_due', 'unpaid'])

// Single place that writes subscription_status so past_due_since and the
// payment-failed email stay in sync with it. Looks the account up by
// Stripe customer ID rather than taking an account row, since every caller
// already has the customer ID from the event and nothing else -- fine
// everywhere except checkout.session.completed, which sets
// stripe_customer_id for the first time and so can't go through this path.
async function updateAccountSubscriptionStatus(
  admin: ReturnType<typeof createAdminClient>,
  params: { stripeCustomerId: string; status: string; tier?: Tier | null }
) {
  const { stripeCustomerId, status, tier } = params
  const { data: account } = await admin
    .from('accounts')
    .select('id, name, subscription_status, past_due_since')
    .eq('stripe_customer_id', stripeCustomerId)
    .maybeSingle()
  if (!account) return

  const wasDunning = DUNNING_STATUSES.has(account.subscription_status ?? '')
  const isDunning = DUNNING_STATUSES.has(status)

  await admin
    .from('accounts')
    .update({
      subscription_status: status,
      // Keeps the original timestamp across repeat past_due/unpaid
      // deliveries (Stripe retries both the charge and the webhook) --
      // only ever set once per dunning episode, cleared on recovery.
      past_due_since: isDunning ? (account.past_due_since ?? new Date().toISOString()) : null,
      ...(tier !== undefined ? { tier } : {}),
    })
    .eq('id', account.id)

  if (isDunning && !wasDunning) {
    const { data: owner } = await admin
      .from('account_users')
      .select('user_id')
      .eq('account_id', account.id)
      .eq('role', 'owner')
      .maybeSingle()
    const ownerEmail = owner?.user_id
      ? (await admin.auth.admin.getUserById(owner.user_id)).data.user?.email
      : undefined
    if (ownerEmail) {
      await sendPaymentFailedEmail({ to: ownerEmail, companyName: account.name })
    }
  }
}

// Must be a Route Handler, not a Server Action: this receives an
// unauthenticated external POST from Stripe with no Next.js session, and
// needs the RAW request body for signature verification. request.text()
// already gives the raw payload in the App Router -- there's no
// Pages-Router-style `bodyParser: false` config to port in here.
export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // Two different Stripe webhook endpoints point at this same URL: a regular
  // account endpoint (SaaS subscription events, platform account) and a
  // Connect endpoint (`connect: true` at creation -- invoice-payment events
  // from connected accounts). Each Stripe endpoint signs with its own
  // secret, so verification tries both rather than assuming one. Locally,
  // `stripe listen` signs everything with a single secret, so
  // STRIPE_CONNECT_WEBHOOK_SECRET is unset there and this just falls
  // through to the one check -- same as before this endpoint pair existed.
  // Whitespace-stripped for the same reason as the secret key -- see
  // lib/stripe/env.ts. Here a stray line break would silently fail every
  // signature check instead of erroring loudly.
  const secrets = [process.env.STRIPE_WEBHOOK_SECRET, process.env.STRIPE_CONNECT_WEBHOOK_SECRET]
    .map((s) => s?.replace(/\s/g, ''))
    .filter((s): s is string => !!s)

  let event: Stripe.Event | undefined
  for (const secret of secrets) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, secret)
      break
    } catch {
      // try the next secret
    }
  }

  if (!event) {
    console.error('Stripe webhook signature verification failed against all configured secrets')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // event.account is only present on events forwarded from a connected
      // account (requires "Listen to events on Connected accounts" enabled
      // on this endpoint in the Stripe Dashboard). A direct-charge invoice
      // payment is the only Checkout flow Frostburn runs on a connected
      // account -- the SaaS subscription checkout below always runs on the
      // platform account itself, so this branch can never fire for it.
      if (event.account) {
        const invoiceId = session.metadata?.invoice_id
        if (!invoiceId) break

        await admin
          .from('invoices')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
          })
          .eq('id', invoiceId)
        break
      }

      const accountId = session.client_reference_id ?? session.metadata?.account_id
      if (!accountId || !session.customer || !session.subscription) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const priceId = subscription.items.data[0]?.price.id
      const tier = priceId ? tierForPriceId(priceId) : null

      await admin
        .from('accounts')
        .update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          tier,
          subscription_status: subscription.status,
        })
        .eq('id', accountId)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const priceId = subscription.items.data[0]?.price.id
      const tier = priceId ? tierForPriceId(priceId) : null

      await updateAccountSubscriptionStatus(admin, {
        stripeCustomerId: subscription.customer as string,
        status: subscription.status,
        tier,
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await updateAccountSubscriptionStatus(admin, {
        stripeCustomerId: subscription.customer as string,
        status: 'canceled',
      })
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
      if (!customerId) break

      await updateAccountSubscriptionStatus(admin, { stripeCustomerId: customerId, status: 'past_due' })
      break
    }
  }

  return NextResponse.json({ received: true })
}
