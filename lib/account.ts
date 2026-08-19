import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// RLS on accounts only allows SELECT where id = private.current_account_id(),
// so a plain unfiltered select() already returns exactly the caller's own
// row (or none) -- no explicit .eq() needed, the database does the scoping.
export async function getCurrentAccount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: account } = await supabase.from('accounts').select('*').maybeSingle()
  if (!account) redirect('/onboarding/plan')

  return { supabase, user, account }
}
