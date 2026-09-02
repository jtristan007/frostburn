import { stripeEnv } from '@/lib/stripe/env'

export type Tier = 'starter' | 'growth' | 'pro'

export const TRIAL_PERIOD_DAYS = 7

export const TIER_LABELS: Record<Tier, string> = {
  starter: 'Starter',
  growth: 'Growth',
  pro: 'Pro',
}

export const TIER_PRICES: Record<Tier, number> = {
  starter: 149,
  growth: 299,
  pro: 499,
}

// The tier names on the pricing page ("1-3 techs", "4-15 techs", "15+
// techs") -- enforced here when inviting a teammate, not just labeling.
export const TIER_TECH_LIMITS: Record<Tier, number> = {
  starter: 3,
  growth: 15,
  pro: Infinity,
}

// Filled in from Stripe Dashboard price IDs -- see .env.local.example.
// Fails loudly at startup rather than silently routing to an empty
// Checkout Session if one is missing. Whitespace-stripped for the same
// reason as the secret key -- see lib/stripe/env.ts.
export const PRICE_IDS: Record<Tier, string> = {
  starter: stripeEnv('STRIPE_PRICE_STARTER'),
  growth: stripeEnv('STRIPE_PRICE_GROWTH'),
  pro: stripeEnv('STRIPE_PRICE_PRO'),
}

export function tierForPriceId(priceId: string): Tier | null {
  const entry = (Object.entries(PRICE_IDS) as [Tier, string][]).find(
    ([, id]) => id === priceId
  )
  return entry ? entry[0] : null
}
