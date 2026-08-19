export type Tier = 'starter' | 'growth' | 'pro'

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

// Filled in from Stripe Dashboard price IDs -- see .env.local.example.
// Fails loudly at startup rather than silently routing to an empty
// Checkout Session if one is missing.
export const PRICE_IDS: Record<Tier, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  growth: process.env.STRIPE_PRICE_GROWTH!,
  pro: process.env.STRIPE_PRICE_PRO!,
}

export function tierForPriceId(priceId: string): Tier | null {
  const entry = (Object.entries(PRICE_IDS) as [Tier, string][]).find(
    ([, id]) => id === priceId
  )
  return entry ? entry[0] : null
}
