'use server'

import { redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import {
  ensureConnectedAccount,
  createOnboardingLink,
  isConnectCountryCode,
} from '@/lib/stripe-connect/client'

// Kicks off (or resumes) Stripe Connect onboarding for the current HVAC
// company. Mirrors connectQuickBooks's redirect-out shape, but there's no
// state/code exchange to do on the way back -- Account Links land the
// account straight on /dashboard/settings/payments, which re-syncs status
// itself.
//
// `country` only matters the first time this runs: ensureConnectedAccount is
// idempotent and returns the existing connected account id (ignoring
// country) on every call after the first, since Stripe accounts don't
// support changing country post-creation. The payments page only renders the
// country field pre-connection for that reason.
export async function connectStripePayments(formData: FormData) {
  const { user, account } = await getCurrentAccount()

  // Only required for the first-ever call for this account -- the payments
  // page doesn't render a country field once stripe_connect_account_id
  // already exists (see comment above), so "Finish setup" submits no
  // country at all. ensureConnectedAccount ignores this value once an
  // account already exists, so any placeholder works there; 'us' is never
  // actually sent to Stripe in that case.
  let country = 'us'
  if (!account.stripe_connect_account_id) {
    const submitted = formData.get('country')
    if (typeof submitted !== 'string' || !isConnectCountryCode(submitted)) {
      redirect(`/dashboard/settings/payments?error=${encodeURIComponent('Choose a valid country.')}`)
    }
    country = submitted
  }

  let url: string
  try {
    const connectedAccountId = await ensureConnectedAccount(account.id, account.name, user.email, country)
    url = await createOnboardingLink(connectedAccountId)
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
