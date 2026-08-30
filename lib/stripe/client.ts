import Stripe from 'stripe'
import { stripeEnv } from '@/lib/stripe/env'

// Server-only. Never import this from a client component.
// See lib/stripe/env.ts for why the key is whitespace-stripped rather than
// read straight from process.env.
export const stripe = new Stripe(stripeEnv('STRIPE_SECRET_KEY'))
