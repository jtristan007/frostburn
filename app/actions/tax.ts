'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getCurrentAccount } from '@/lib/account'
import { createAdminClient } from '@/lib/supabase/admin'

// Saves the shop's GST/HST registration number, printed on its invoices.
// Blank clears it. Loose format check only: a CRA business number is nine
// digits, usually followed by "RT0001"; anything far off is likely a typo.
export async function saveGstNumber(formData: FormData) {
  const { account } = await getCurrentAccount()
  const raw = ((formData.get('gst_number') as string) ?? '').trim().toUpperCase()
  const back = '/dashboard/settings/payments'

  if (raw && !/^\d{9}(\s?RT\s?\d{4})?$/.test(raw)) {
    redirect(`${back}?error=${encodeURIComponent('That doesn’t look like a GST/HST number. It’s 9 digits, usually followed by RT0001.')}`)
  }

  const { error } = await createAdminClient()
    .from('accounts')
    .update({ gst_number: raw || null })
    .eq('id', account.id)
  if (error) {
    console.error('Saving GST number failed:', error)
    redirect(`${back}?error=${encodeURIComponent('Could not save your GST/HST number. Please try again.')}`)
  }

  revalidatePath(back)
  redirect(`${back}?saved=gst`)
}
