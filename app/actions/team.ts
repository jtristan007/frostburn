'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentAccount } from '@/lib/account'
import { createAdminClient } from '@/lib/supabase/admin'
import { TIER_TECH_LIMITS, type Tier } from '@/lib/stripe/plans'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function inviteTeammate(formData: FormData): Promise<{ error?: string }> {
  const { supabase, account } = await getCurrentAccount()

  const email = ((formData.get('email') as string) || '').trim().toLowerCase()
  const fullName = ((formData.get('full_name') as string) || '').trim()
  const role = ((formData.get('role') as string) || 'technician') as 'admin' | 'technician'

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
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      invited_account_id: account.id,
      invited_role: role,
      full_name: fullName || undefined,
    },
    redirectTo: `${siteUrl}/auth/callback`,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings/team')
  return {}
}

export async function removeTeammate(userId: string) {
  const { account } = await getCurrentAccount()
  const admin = createAdminClient()
  await admin.from('account_users').delete().eq('user_id', userId).eq('account_id', account.id)
  revalidatePath('/dashboard/settings/team')
}
