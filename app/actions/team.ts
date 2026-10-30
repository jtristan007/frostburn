'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentAccount } from '@/lib/account'
import { createAdminClient } from '@/lib/supabase/admin'
import { TIER_TECH_LIMITS, type Tier } from '@/lib/stripe/plans'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

// The caller's role in their own account. Team management is for owners
// and admins only -- the UI hid the buttons, but these actions are public
// endpoints and used to accept any member.
async function callerRole() {
  const { supabase, user, account } = await getCurrentAccount()
  const { data } = await supabase.from('account_users').select('role').eq('user_id', user.id).maybeSingle()
  return { supabase, user, account, role: (data?.role as string | undefined) ?? null }
}

export async function inviteTeammate(formData: FormData): Promise<{ error?: string }> {
  const { supabase, account, role: myRole } = await callerRole()
  if (myRole !== 'owner' && myRole !== 'admin') return { error: 'Only the owner or an admin can invite teammates.' }

  const email = ((formData.get('email') as string) || '').trim().toLowerCase()
  const fullName = ((formData.get('full_name') as string) || '').trim()
  // Never 'owner': there is exactly one owner, the person who signed up.
  const role = formData.get('role') === 'admin' ? 'admin' : 'technician'

  if (!email) return { error: 'Enter an email address.' }
  if (!account.tier) return { error: 'Choose a plan before inviting your team.' }

  const { count } = await supabase.from('account_users').select('id', { count: 'exact', head: true })
  const limit = TIER_TECH_LIMITS[account.tier as Tier] ?? 1

  if ((count ?? 0) >= limit) {
    return {
      error: `Your ${account.tier} plan includes up to ${limit} team member${limit === 1 ? '' : 's'}. Upgrade to add more.`,
    }
  }

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName || undefined },
    redirectTo: `${siteUrl}/auth/callback`,
  })
  if (error || !data.user) return { error: error?.message ?? 'Could not send the invite.' }

  // Which account and role the invite is for lives in app_metadata, which
  // only the service role can set -- see createAccountForNewUser.
  const { error: metaError } = await admin.auth.admin.updateUserById(data.user.id, {
    app_metadata: { invited_account_id: account.id, invited_role: role },
  })
  if (metaError) {
    console.error('Recording invite failed:', metaError)
    await admin.auth.admin.deleteUser(data.user.id)
    return { error: 'Could not send the invite. Please try again.' }
  }

  revalidatePath('/dashboard/settings/team')
  return {}
}

// Removes a teammate for good: deletes their login, which also removes their
// account_users row (on delete cascade). Just deleting the membership row
// left the login in place, and the next password reset re-joined them.
export async function removeTeammate(userId: string) {
  const { user, account, role: myRole } = await callerRole()
  if (myRole !== 'owner' && myRole !== 'admin') return
  if (userId === user.id) return

  const admin = createAdminClient()
  const { data: member } = await admin
    .from('account_users')
    .select('role')
    .eq('user_id', userId)
    .eq('account_id', account.id)
    .maybeSingle()
  if (!member || member.role === 'owner') return

  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) {
    console.error('Removing teammate failed:', error)
    // Fall back to removing the membership and the invite that would let
    // them back in on their next login.
    await admin.auth.admin.updateUserById(userId, { app_metadata: { invited_account_id: null, invited_role: null } })
    await admin.from('account_users').delete().eq('user_id', userId).eq('account_id', account.id)
  }
  revalidatePath('/dashboard/settings/team')
}
