'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { PRICING_BOOK_SEED } from '@/lib/pricing-book/seed-data'
import type { User } from '@supabase/supabase-js'

// Called from app/auth/callback/route.ts right after a new signup confirms
// their email. This is the one legitimate bypass of "no client insert
// policy on accounts" -- a brand-new user has no account_id yet, so RLS
// (which is scoped BY account_id) can't let them create their own account
// row. The service-role client sidesteps RLS entirely for this one step.
//
// Idempotent: if this user already has an account_users row (e.g. they hit
// the callback link twice), do nothing instead of creating a duplicate.
export async function createAccountForNewUser(user: User): Promise<string> {
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) return existing.account_id

  // Invited teammates never go through the "new company" path -- they join
  // the account they were invited into. Set on the auth user by
  // inviteTeammate() (app/actions/team.ts) via inviteUserByEmail's `data`.
  const invitedAccountId = user.user_metadata?.invited_account_id as string | undefined
  if (invitedAccountId) {
    const role = (user.user_metadata?.invited_role as string) || 'technician'
    const { error } = await admin.from('account_users').insert({
      account_id: invitedAccountId,
      user_id: user.id,
      role,
      full_name: (user.user_metadata?.full_name as string) || user.email,
    })
    if (error) throw new Error(error.message)
    return invitedAccountId
  }

  const companyName = (user.user_metadata?.company_name as string) || 'My Company'

  const { data: account, error: accountError } = await admin
    .from('accounts')
    .insert({ name: companyName })
    .select('id')
    .single()

  if (accountError || !account) {
    throw new Error(accountError?.message ?? 'Could not create account.')
  }

  const { error: memberError } = await admin.from('account_users').insert({
    account_id: account.id,
    user_id: user.id,
    role: 'owner',
    full_name: user.email,
  })

  if (memberError) {
    throw new Error(memberError.message)
  }

  const seedItems = PRICING_BOOK_SEED.map((item) => ({
    ...item,
    account_id: account.id,
  }))
  const { error: seedError } = await admin.from('pricing_book_items').insert(seedItems)
  if (seedError) {
    // Not fatal -- the account and login work either way, and the pricing
    // book page can still be used empty. Surface it server-side only.
    console.error('pricing_book_items seed failed:', seedError.message)
  }

  return account.id
}
