import { TIER_PRICES } from '@/lib/stripe/plans'

// Plan cards shown on the homepage and topic pages. Prices come from the
// same source as checkout.
export const TIERS = [
  {
    name: 'Starter',
    price: TIER_PRICES.starter,
    techs: '1–5 techs',
    features: [
      'Pricing book & quotes',
      'Equipment history',
      'Scheduling',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: TIER_PRICES.growth,
    techs: '6–15 techs',
    popular: true,
    features: [
      'Everything in Starter',
      'Maintenance agreement tracking',
      'Filter & warranty alerts',
      'Priority support',
    ],
  },
  {
    name: 'Pro',
    price: TIER_PRICES.pro,
    techs: '15+ techs',
    features: [
      'Everything in Growth',
      'Unlimited techs',
      'Personal onboarding & data import done for you',
      'Direct line to the founder',
    ],
  },
]
