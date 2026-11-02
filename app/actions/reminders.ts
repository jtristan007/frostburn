'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentAccount } from '@/lib/account'
import { createAdminClient } from '@/lib/supabase/admin'

// Turns automatic overdue-invoice reminders on or off for the caller's
// account. Owners and admins only: this is a public endpoint, so the role
// is checked here, not just by hiding the button.
export async function setOverdueReminders(formData: FormData) {
  const { supabase, user, account } = await getCurrentAccount()
  const back = '/dashboard/settings/reminders'

  const { data: me } = await supabase.from('account_users').select('role').eq('user_id', user.id).maybeSingle()
  if (me?.role !== 'owner' && me?.role !== 'admin') {
    redirect(`${back}?error=${encodeURIComponent('Only the account owner or an admin can change reminders.')}`)
  }

  const enabled = formData.get('enabled') === 'on'

  // accounts has no client-facing UPDATE policy -- see app/actions/tax.ts.
  const { error } = await createAdminClient()
    .from('accounts')
    .update({ overdue_reminders_enabled: enabled })
    .eq('id', account.id)
  if (error) {
    console.error('Saving reminder setting failed:', error)
    redirect(`${back}?error=${encodeURIComponent('Could not save your reminder setting. Please try again.')}`)
  }

  revalidatePath(back)
  redirect(`${back}?saved=${enabled ? 'on' : 'off'}`)
}
