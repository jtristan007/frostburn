import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

// Countries offered to an HVAC company connecting Stripe -- not the full set
// Stripe Connect supports (that list changes over time), a curated subset
// covering where Frostburn's actual audience is likely located. An
// unsupported choice isn't a crash: it just surfaces as a Stripe API error
// through connectStripePayments's existing try/catch, same as any other
// Stripe rejection. Frostburn's own pricing/invoicing currency stays
// hardcoded USD regardless of which of these is picked (see
// ensureConnectedAccount) -- widening this list to non-English-speaking or
// non-USD-typical markets should come with a currency-handling pass, not
// just adding a country code here.
export const CONNECT_COUNTRIES = [
  { code: 'us', label: 'United States' },
  { code: 'ca', label: 'Canada' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'au', label: 'Australia' },
  { code: 'nz', label: 'New Zealand' },
  { code: 'ie', label: 'Ireland' },
] as const

export type ConnectCountryCode = (typeof CONNECT_COUNTRIES)[number]['code']

export function isConnectCountryCode(value: string): value is ConnectCountryCode {
  return CONNECT_COUNTRIES.some((c) => c.code === value)
}

// Frostburn is a SaaS platform, not a marketplace: each connected account is
// one HVAC company, and it is the merchant of record for its own customers'
// invoice payments -- Stripe never treats Frostburn as the seller. That's
// direct charges + a full Stripe Dashboard (the HVAC company gets its own
// independent Stripe login, statements, and Stripe-direct support -- the v2
// equivalent of a "Standard" connected account) + Stripe-hosted onboarding.
// fees_collector/losses_collector are "stripe": Stripe collects its own
// processing fees and carries negative-balance risk directly from the
// connected account rather than Frostburn eating either. This pairing
// (dashboard "full" + "stripe"-collected fees/losses) is the documented
// Standard-equivalent config; "stripe" fees_collector is NOT compatible with
// dashboard "express" (that pairing is rejected by the API) -- don't change
// dashboard away from "full" without also reverting the collectors back to
// "application".
//
// Deliberately separate from stripe_customer_id / stripe_subscription_id on
// the same `accounts` row, which is Frostburn's own SaaS subscription
// billing of this account on the *platform's* Stripe account -- an
// unrelated Stripe relationship that already existed before this file.

type ConnectStatus = 'not_connected' | 'onboarding' | 'active'

export async function ensureConnectedAccount(
  accountId: string,
  companyName: string,
  contactEmail: string | undefined,
  country: string
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
    dashboard: 'full',
    // Only the country needs to be seeded up front -- Stripe's own Account
    // Link onboarding flow (created right after this) collects the rest of
    // identity (entity type, business details, individual info)
    // incrementally. Chosen by the HVAC company itself at connect-time (see
    // connectStripePayments), not assumed -- Frostburn's own pricing/invoicing
    // currency stays hardcoded USD regardless of which country is picked
    // here; a non-US company still gets billed and invoices in USD today.
    identity: { country },
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
        fees_collector: 'stripe',
        losses_collector: 'stripe',
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

// Re-reads the connected account's live status directly from Stripe (never
// trusts locally cached state) and writes it back to `accounts`. Called both
// from the Payments settings page on load (Account Links redirect straight
// back with no code to exchange, so a read-on-return is needed regardless)
// and from the account-events webhook (app/api/stripe/webhook/account-events)
// when Stripe pushes a requirements or capability-status change
// out-of-band -- e.g. an existing card_payments capability later being
// restricted for a compliance reason. The two call sites share this one
// retrieve-and-write instead of duplicating the capability -> status mapping.
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

// Same sync, addressed by the Stripe connected-account ID rather than
// Frostburn's internal account id -- the shape a webhook receives events in.
// Looks up the owning Frostburn account first since stripe_connect_account_id
// is unique but isn't the primary key. Returns silently (no-op) if no
// Frostburn account references this connected account id, which can
// legitimately happen for an event about an account that's since been
// disconnected.
export async function syncConnectedAccountStatusByStripeAccountId(
  connectedAccountId: string
): Promise<void> {
  const admin = createAdminClient()
  const { data: account } = await admin
    .from('accounts')
    .select('id')
    .eq('stripe_connect_account_id', connectedAccountId)
    .maybeSingle()

  if (!account) return

  await syncConnectedAccountStatus(account.id, connectedAccountId)
}
