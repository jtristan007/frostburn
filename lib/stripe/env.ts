// Reads a Stripe credential from the environment with ALL whitespace
// removed, not just trimmed.
//
// This is not defensive tidying, it fixes a real outage. A secret pasted
// into a hosting provider's env-var UI can pick up a line break -- at the
// end, or in the middle if the paste wrapped. Node refuses to put CR or LF
// in an HTTP header value, so every Stripe request fails before it leaves
// the machine, and stripe-node reports it as:
//
//   "An error occurred with our connection to Stripe. Request was retried 2 times."
//
// which points at the network rather than at the credential. Reproduced
// against the real key: a trailing newline AND an interior newline both
// produce exactly that error, and `.trim()` only rescues the trailing case.
// A stray space is harmless (spaces are legal in header values), so the
// blast radius is specifically CR/LF.
//
// None of these values (secret key, price IDs, webhook secrets) can legally
// contain whitespace, so removing all of it is safe and strictly more
// robust than trimming.
export function stripeEnv(name: string): string {
  const raw = process.env[name]
  if (!raw) throw new Error(`Missing required environment variable: ${name}`)
  return raw.replace(/\s/g, '')
}
