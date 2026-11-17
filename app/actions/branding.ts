'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentAccount } from '@/lib/account'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_BYTES = 3 * 1024 * 1024
const EXT_BY_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}
const ALLOWED_TYPES = Object.keys(EXT_BY_TYPE)

export async function updateLogo(formData: FormData): Promise<{ error?: string }> {
  const { supabase, account } = await getCurrentAccount()
  const file = formData.get('logo') as File | null

  if (!file || file.size === 0) return { error: 'Choose a file first.' }
  if (file.size > MAX_BYTES) return { error: 'That file is too large. Try a PNG or JPEG under 3MB.' }
  if (!ALLOWED_TYPES.includes(file.type)) return { error: 'Use a PNG, JPEG, WebP or SVG file.' }

  // Extension from the checked type, not the file name (names can have no
  // extension, or the wrong one).
  const ext = EXT_BY_TYPE[file.type]
  const path = `${account.id}/logo.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message }

  const {
    data: { publicUrl },
  } = supabase.storage.from('logos').getPublicUrl(path)

  // Cache-bust -- the path is stable (upsert overwrites the same file), so
  // without this the browser and CDN keep serving the old image after a
  // re-upload.
  const bustedUrl = `${publicUrl}?v=${Date.now()}`

  // accounts has no client-facing UPDATE policy (see lib/supabase/admin.ts) --
  // the service-role client is the only thing that can write logo_url. Safe
  // here because account.id came from the caller's own RLS-scoped session,
  // never from user input.
  const admin = createAdminClient()
  const { error: updateError } = await admin.from('accounts').update({ logo_url: bustedUrl }).eq('id', account.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/dashboard/settings/branding')
  revalidatePath('/dashboard/invoices')
  return {}
}
