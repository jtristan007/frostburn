'use server'

import { redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { createAdminClient } from '@/lib/supabase/admin'
import { countryOf, parseCountry } from '@/lib/money'
import {
  ensureConnectedAccount,
  createOnboardingLink,
  isUnreachableConnectedAccount,
  resetConnectedAccount,
} from '@/lib/stripe-connect/client'

// Kicks off (or resumes) Stripe Connect onboarding for the current HVAC
// company. Mirrors connectQuickBooks's redirect-out shape, but there's no
// state/code exchange to do on the way back -- Account Links land the
// account straight on /dashboard/settings/payments, which re-syncs status
// itself.
// The first connect also records which country the shop is in (the form
// asks only while no connected account exists, since Stripe fixes the
// country at creation).
export async function connectStripePayments(formData: FormData) {
  const { user, account } = await getCurrentAccount()

  let country = countryOf(account)
  const chosen = parseCountry(formData.get('country'))
  if (chosen && !account.stripe_connect_account_id && chosen !== country) {
    const { error } = await createAdminClient().from('accounts').update({ country: chosen }).eq('id', account.id)
    if (error) {
      console.error('Saving account country failed:', error)
      redirect(`/dashboard/settings/payments?error=${encodeURIComponent('Could not save your country. Please try again.')}`)
    }
    country = chosen
  }

  let url: string
  try {
    let connectedAccountId = await ensureConnectedAccount(account.id, account.name, user.email, country)
    try {
      url = await createOnboardingLink(connectedAccountId)
    } catch (err) {
      // Stored account belongs to an old Stripe key: start over once with
      // a fresh connected account under the current key.
      if (!isUnreachableConnectedAccount(err)) throw err
      await resetConnectedAccount(account.id)
      connectedAccountId = await ensureConnectedAccount(account.id, account.name, user.email, country)
      url = await createOnboardingLink(connectedAccountId)
    }
  } catch (err) {
    // Same failure mode as the sync in the Payments page: a connected
    // account created against one Stripe key can't be reached with a
    // different key configured now. Surface it instead of crashing.
    console.error('Stripe Connect onboarding failed:', err)
    const message = err instanceof Error ? err.message : 'Could not start Stripe onboarding.'
    redirect(`/dashboard/settings/payments?error=${encodeURIComponent(message)}`)
  }

  redirect(url)
}
