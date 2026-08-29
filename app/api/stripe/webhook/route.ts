import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { tierForPriceId } from '@/lib/stripe/plans'

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

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
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

      await admin
        .from('accounts')
        .update({ tier, subscription_status: subscription.status })
        .eq('stripe_customer_id', subscription.customer as string)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await admin
        .from('accounts')
        .update({ subscription_status: 'canceled' })
        .eq('stripe_customer_id', subscription.customer as string)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
      if (!customerId) break

      await admin
        .from('accounts')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_customer_id', customerId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
