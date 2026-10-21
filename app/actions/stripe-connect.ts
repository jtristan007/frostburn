'use server'

import { redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
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
export async function connectStripePayments() {
  const { user, account } = await getCurrentAccount()

  let url: string
  try {
    let connectedAccountId = await ensureConnectedAccount(account.id, account.name, user.email)
    try {
      url = await createOnboardingLink(connectedAccountId)
    } catch (err) {
      // Stored account belongs to an old Stripe key: start over once with
      // a fresh connected account under the current key.
      if (!isUnreachableConnectedAccount(err)) throw err
      await resetConnectedAccount(account.id)
      connectedAccountId = await ensureConnectedAccount(account.id, account.name, user.email)
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
