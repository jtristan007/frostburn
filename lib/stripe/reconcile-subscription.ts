import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { tierForPriceId } from '@/lib/stripe/plans'

// Backup for the checkout.session.completed webhook. If that webhook is
// rejected or never arrives, the owner finishes Stripe Checkout but their
// account never learns about the subscription: no tier, no trial, and the
// dashboard keeps saying "Choose a plan" (while the plan page refuses to
// start a second subscription, because Stripe already has one).
//
// This asks Stripe directly for a completed subscription Checkout Session
// that was started FOR THIS ACCOUNT (client_reference_id === accountId, set
// in createCheckoutSession) and records it exactly the way the webhook
// would. Matching on the account id -- not just the email -- means it can
// never attach another account's subscription. Idempotent; never throws.
// Returns true when the account now has a subscription recorded.
export async function reconcileAccountSubscription(accountId: string, email: string | undefined | null): Promise<boolean> {
  if (!email) return false
  const admin = createAdminClient()

  try {
    const sessions = await stripe.checkout.sessions.list({
      customer_details: { email },
      status: 'complete',
      limit: 20,
    })
    const session = sessions.data.find(
      (s) => s.mode === 'subscription' && s.client_reference_id === accountId && s.customer && s.subscription
    )
    if (!session) return false

    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription!.id
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0]?.price.id
    const tier = priceId ? tierForPriceId(priceId) : null

    const { error } = await admin
      .from('accounts')
      .update({
        stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer!.id,
        stripe_subscription_id: subscription.id,
        tier,
        subscription_status: subscription.status,
      })
      .eq('id', accountId)
      // Never overwrite a subscription the webhook already recorded.
      .is('stripe_subscription_id', null)
    if (error) {
      console.error('reconcileAccountSubscription update failed:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.error('reconcileAccountSubscription failed:', err)
    return false
  }
}
