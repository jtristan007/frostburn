'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { PRICE_IDS, type Tier } from '@/lib/stripe/plans'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

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
    .single()

  if (!membership) throw new Error('No account found for this user.')

  return { accountId: membership.account_id, email: user.email }
}

export async function createCheckoutSession(tier: Tier) {
  const { accountId, email } = await getAccountId()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PRICE_IDS[tier], quantity: 1 }],
    client_reference_id: accountId,
    customer_email: email,
    success_url: `${siteUrl}/dashboard?checkout=success`,
    cancel_url: `${siteUrl}/onboarding/plan?checkout=cancelled`,
    metadata: { account_id: accountId, tier },
  })

  if (!session.url) throw new Error('Stripe did not return a Checkout URL.')
  redirect(session.url)
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
