import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service-role client -- bypasses RLS entirely. Server-only: this file must
// never be imported from a client component, and SUPABASE_SERVICE_ROLE_KEY
// must never carry a NEXT_PUBLIC_ prefix or it ships to the browser.
//
// Used in exactly two places: account.ts's createAccountForNewUser (the one
// legitimate bypass of "no client insert policy on accounts"), and the
// Stripe webhook (which has no user session/cookies to scope a normal
// client to).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
