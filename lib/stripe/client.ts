import Stripe from 'stripe'

// Server-only. Never import this from a client component.
//
// .trim() is not cosmetic. A secret pasted into a hosting provider's env-var
// UI can pick up a trailing newline, and Node refuses to put a newline in an
// HTTP header value -- so every Stripe call fails before it leaves the
// machine, and stripe-node reports that as "An error occurred with our
// connection to Stripe. Request was retried 2 times." That message points at
// the network, not at the key, which cost real debugging time on this
// project. Reproduced and confirmed: a trailing "\n" gives exactly that
// error, while a trailing space does not.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim())
