import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { reconcileAccountSubscription } from '@/lib/stripe/reconcile-subscription'

// RLS on accounts only allows SELECT where id = private.current_account_id(),
// so a plain unfiltered select() already returns exactly the caller's own
// row (or none) -- no explicit .eq() needed, the database does the scoping.
export async function getCurrentAccount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: found } = await supabase.from('accounts').select('*').maybeSingle()
  if (!found) redirect('/onboarding/plan')
  let account = found

  // No subscription recorded: check Stripe directly in case the owner
  // finished Checkout but the webhook was missed (see
  // reconcile-subscription.ts). Only runs while the account has no
  // subscription, so subscribed accounts never pay for the extra call.
  if (!account.stripe_subscription_id && (await reconcileAccountSubscription(account.id, user.email))) {
    const { data: refreshed } = await supabase.from('accounts').select('*').maybeSingle()
    if (refreshed) account = refreshed
  }

  return { supabase, user, account }
}
