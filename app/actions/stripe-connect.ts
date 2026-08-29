'use server'

import { redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { ensureConnectedAccount, createOnboardingLink } from '@/lib/stripe-connect/client'

// Kicks off (or resumes) Stripe Connect onboarding for the current HVAC
// company. Mirrors connectQuickBooks's redirect-out shape, but there's no
// state/code exchange to do on the way back -- Account Links land the
// account straight on /dashboard/settings/payments, which re-syncs status
// itself.
export async function connectStripePayments() {
  const { user, account } = await getCurrentAccount()
  const connectedAccountId = await ensureConnectedAccount(account.id, account.name, user.email)
  const url = await createOnboardingLink(connectedAccountId)
  redirect(url)
}
