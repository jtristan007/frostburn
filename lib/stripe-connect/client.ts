import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

// Frostburn is a SaaS platform, not a marketplace: each connected account is
// one HVAC company, and it is the merchant of record for its own customers'
// invoice payments -- Stripe never treats Frostburn as the seller. That's
// direct charges + an Express dashboard (so the HVAC company can see its own
// payouts) + Stripe-hosted onboarding. Frostburn charges no application fee
// yet, so fees_collector/losses_collector are "application" -- Frostburn
// eats Stripe's processing fees and carries the risk, rather than pushing
// either onto the connected account. This is the validated shape from the
// Stripe Connect recommendation this feature was built from; revisit if a
// take-rate is ever added (see the compatibility notes in that plan before
// changing fees_collector to "stripe" on an express dashboard -- that
// specific combination is blocked).
//
// Deliberately separate from stripe_customer_id / stripe_subscription_id on
// the same `accounts` row, which is Frostburn's own SaaS subscription
// billing of this account on the *platform's* Stripe account -- an
// unrelated Stripe relationship that already existed before this file.

type ConnectStatus = 'not_connected' | 'onboarding' | 'active'

export async function ensureConnectedAccount(
  accountId: string,
  companyName: string,
  contactEmail: string | undefined
): Promise<string> {
  const admin = createAdminClient()
  const { data: existing } = await admin
    .from('accounts')
    .select('stripe_connect_account_id')
    .eq('id', accountId)
    .maybeSingle()

  if (existing?.stripe_connect_account_id) return existing.stripe_connect_account_id

  const account = await stripe.v2.core.accounts.create({
    display_name: companyName,
    contact_email: contactEmail,
    dashboard: 'express',
    // Only the country needs to be seeded up front -- Stripe's own
    // Account Link onboarding flow (created right after this) collects
    // the rest of identity (entity type, business details, individual
    // info) incrementally. Defaults to 'us' to match the USD currency
    // already hardcoded across billing/invoicing; revisit if Frostburn's
    // actual HVAC customers are Canadian instead.
    identity: { country: 'us' },
    configuration: {
      merchant: {
        capabilities: {
          card_payments: { requested: true },
        },
      },
    },
    defaults: {
      currency: 'usd',
      responsibilities: {
        fees_collector: 'application',
        losses_collector: 'application',
      },
    },
  })

  await admin
    .from('accounts')
    .update({ stripe_connect_account_id: account.id, stripe_connect_status: 'onboarding' })
    .eq('id', accountId)

  return account.id
}

export async function createOnboardingLink(connectedAccountId: string): Promise<string> {
  const link = await stripe.v2.core.accountLinks.create({
    account: connectedAccountId,
    use_case: {
      type: 'account_onboarding',
      account_onboarding: {
        collection_options: { fields: 'eventually_due' },
        configurations: ['merchant'],
        return_url: `${siteUrl}/dashboard/settings/payments?onboarding=return`,
        refresh_url: `${siteUrl}/dashboard/settings/payments?onboarding=refresh`,
      },
    },
  })
  return link.url
}

// Re-reads the connected account's live status from Stripe and writes it
// back to `accounts`. Called from the Payments settings page rather than
// from a webhook: Account Links redirect straight back with no code to
// exchange, and wiring a second (v2 Accounts) event-destination pipeline
// alongside the existing v1 webhook just to catch this is more infra than a
// read-on-page-load justifies right now. Known gap: if Stripe later disables
// the account for a compliance reason, status goes stale until the HVAC
// company next opens this page -- acceptable for launch, revisit if it
// bites.
export async function syncConnectedAccountStatus(
  accountId: string,
  connectedAccountId: string
): Promise<ConnectStatus> {
  const admin = createAdminClient()
  const account = await stripe.v2.core.accounts.retrieve(connectedAccountId, {
    include: ['configuration.merchant'],
  })

  const chargesEnabled =
    account.configuration?.merchant?.capabilities?.card_payments?.status === 'active'
  const status: ConnectStatus = chargesEnabled ? 'active' : 'onboarding'

  await admin
    .from('accounts')
    .update({ stripe_connect_status: status, stripe_connect_charges_enabled: chargesEnabled })
    .eq('id', accountId)

  return status
}
