import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { stripeEnv } from '@/lib/stripe/env'
import { syncConnectedAccountStatusByStripeAccountId } from '@/lib/stripe-connect/client'

// Separate endpoint, separate secret, separate delivery mechanism from
// app/api/stripe/webhook: that route is classic v1 webhook endpoints
// (constructEvent, "stripe-signature" header) carrying Frostburn's own
// platform subscription events and the existing invoice-payment Connect
// event. v2 Accounts don't emit events through a classic webhook endpoint at
// all -- they're delivered as thin events through a v2 Event Destination,
// verified with a different method (parseEventNotification) and signed with
// the Event Destination's own signing secret, not either secret the other
// route checks. Keeping this on its own route/secret means an outage or
// misconfiguration here can't take down platform subscription billing, and
// vice versa.
//
// This route only handles connected-account lifecycle events (is the
// account still able to take card payments, what does it still owe Stripe
// to finish onboarding) -- never payment events. The existing invoice
// payment flow (checkout.session.completed on the connected account) stays
// on the other route; nothing here touches invoices or money movement.
//
// Setup this route needs that Frostburn does NOT do automatically (per
// explicit instruction not to modify live Stripe settings): create a v2
// Event Destination pointed at this route's URL, type "webhook_endpoint",
// event_payload "thin", enabled_events including
// "v2.core.account[requirements].updated" and
// "v2.core.account[configuration.merchant].capability_status_updated". Do
// this once per environment (test and live separately) via the Stripe CLI
// or Dashboard, then put the resulting signing secret in
// STRIPE_CONNECT_ACCOUNT_EVENTS_SECRET.
//
// configuration.customer's capability_status_updated is intentionally not
// handled here: account creation (lib/stripe-connect/client.ts) only ever
// requests a `merchant` configuration, never `customer`, so that event type
// can never fire for any account this app creates.
export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let notification: ReturnType<typeof stripe.parseEventNotification>
  try {
    notification = stripe.parseEventNotification(
      body,
      signature,
      stripeEnv('STRIPE_CONNECT_ACCOUNT_EVENTS_SECRET')
    )
  } catch (err) {
    console.error('Stripe account-events webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (notification.type) {
    case 'v2.core.account[requirements].updated':
    case 'v2.core.account[configuration.merchant].capability_status_updated': {
      // related_object.id is the connected account's own id for every
      // account-scoped event type -- re-derive Frostburn's status (charges
      // enabled or not) straight from Stripe rather than trusting anything
      // about *why* it changed carried in the event itself.
      const connectedAccountId = notification.related_object?.id
      if (connectedAccountId) {
        await syncConnectedAccountStatusByStripeAccountId(connectedAccountId)
      }
      break
    }
    default:
      break
  }

  return NextResponse.json({ received: true })
}
