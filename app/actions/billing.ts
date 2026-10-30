'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { PRICE_IDS, TRIAL_PERIOD_DAYS, type Tier } from '@/lib/stripe/plans'
import { createAccountForNewUser } from '@/app/actions/account'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

// A confirmed, logged-in user with no account_users row is a real state
// that has happened in production (a gap between email confirmation and
// account creation, from before this self-heal existed) -- previously this
// threw a raw Error that crashed straight to Next's generic "this page
// couldn't load" screen, on the exact page (/onboarding/plan) meant to get
// someone into a paid plan. createAccountForNewUser is idempotent and is
// the same account-creation path signup itself uses, so retrying it here
// is safe and fixes the user's account on the spot instead of crashing.
async function getAccountId(): Promise<{ accountId: string; email: string | undefined }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .maybeSingle()

  const accountId = membership?.account_id ?? (await createAccountForNewUser(user))

  return { accountId, email: user.email }
}

const LIVE_SUBSCRIPTION_STATUSES = ['trialing', 'active', 'past_due', 'unpaid', 'incomplete']

// True when this account already has a subscription, so the plan page
// can't start a second one (e.g. the owner hits Back after Checkout). Checks
// the database first, then Stripe itself by email, because the webhook that
// records a new subscription can land a few seconds after Checkout returns.
// Deliberately not exported: exports of a 'use server' file are callable
// endpoints, and this takes an arbitrary account id and email.
async function hasLiveSubscription(accountId: string, email: string | undefined): Promise<boolean> {
  const supabase = await createClient()
  const { data: account } = await supabase
    .from('accounts')
    .select('subscription_status')
    .eq('id', accountId)
    .maybeSingle()
  if (account?.subscription_status && LIVE_SUBSCRIPTION_STATUSES.includes(account.subscription_status)) return true
  if (!email) return false

  try {
    const customers = await stripe.customers.list({ email, limit: 10 })
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 10 })
      if (subs.data.some((s) => LIVE_SUBSCRIPTION_STATUSES.includes(s.status))) return true
    }
  } catch (err) {
    // Don't block signup on a Stripe lookup failure; worst case is the
    // duplicate this check exists to catch.
    console.error('Checking for an existing subscription failed:', err)
  }
  return false
}

export async function createCheckoutSession(tier: Tier) {
  const { accountId, email } = await getAccountId()

  if (await hasLiveSubscription(accountId, email)) {
    redirect('/dashboard/settings/billing')
  }

  let url: string
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: PRICE_IDS[tier], quantity: 1 }],
      client_reference_id: accountId,
      customer_email: email,
      // The signup page promises "no credit card required to start", so
      // only collect a card if Stripe needs one (it doesn't for a trial).
      // A trial that ends without a card on file cancels instead of
      // leaving an unpaid subscription behind.
      payment_method_collection: 'if_required',
      subscription_data: {
        trial_period_days: TRIAL_PERIOD_DAYS,
        trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
      },
      success_url: `${siteUrl}/dashboard?checkout=success`,
      cancel_url: `${siteUrl}/onboarding/plan?checkout=cancelled`,
      metadata: { account_id: accountId, tier },
    })
    if (!session.url) throw new Error('Stripe did not return a Checkout URL.')
    url = session.url
  } catch (err) {
    // A Stripe failure here used to throw straight through and render the
    // generic "this page couldn't load" screen, which hides the actual
    // reason from both the user and anyone debugging. Send the message back
    // to the plan page instead.
    console.error('Stripe Checkout session creation failed:', err)
    const message = err instanceof Error ? err.message : 'Could not start checkout.'
    redirect(`/onboarding/plan?error=${encodeURIComponent(message)}`)
  }

  redirect(url)
}

export async function createPortalSession() {
  const supabase = await createClient()
  const { accountId } = await getAccountId()

  const { data: account } = await supabase
    .from('accounts')
    .select('stripe_customer_id')
    .eq('id', accountId)
    .single()

  if (!account?.stripe_customer_id) {
    throw new Error('No Stripe customer on file yet -- complete checkout first.')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: account.stripe_customer_id,
    return_url: `${siteUrl}/dashboard/settings/billing`,
  })

  redirect(session.url)
}
