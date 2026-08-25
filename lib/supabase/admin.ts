import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service-role client -- bypasses RLS entirely. Server-only: this file must
// never be imported from a client component, and SUPABASE_SERVICE_ROLE_KEY
// must never carry a NEXT_PUBLIC_ prefix or it ships to the browser.
//
// Used in a few legitimate bypasses of accounts' RLS (which allows SELECT
// only, no client-facing writes): account.ts's createAccountForNewUser, the
// Stripe webhook (no user session/cookies to scope a normal client to), and
// branding.ts's logo upload (account.id there always comes from the
// caller's own RLS-scoped session, never from user input).
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
