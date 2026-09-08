'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/resend/emails'

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string) || null

  const { data, error } = await supabase
    .from('customers')
    .insert({
      name: formData.get('name') as string,
      email,
      phone: (formData.get('phone') as string) || null,
      address: (formData.get('address') as string) || null,
      city: (formData.get('city') as string) || 'Vancouver',
      notes: (formData.get('notes') as string) || null,
    })
    .select('id')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Could not create customer.')

  if (email) {
    const { data: account } = await supabase.from('accounts').select('name').single()
    if (account) {
      await sendWelcomeEmail({
        to: email,
        customerName: formData.get('name') as string,
        companyName: account.name,
      })
    }
  }

  redirect(`/dashboard/customers/${data.id}`)
}

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('customers')
    .update({
      name: formData.get('name') as string,
      email: (formData.get('email') as string) || null,
      phone: (formData.get('phone') as string) || null,
      address: (formData.get('address') as string) || null,
      city: (formData.get('city') as string) || 'Vancouver',
      notes: (formData.get('notes') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  redirect(`/dashboard/customers/${id}`)
}

export type ImportResult = { imported: number; skipped: number } | { error: string }

type ImportRow = Partial<Record<'name' | 'email' | 'phone' | 'address' | 'city' | 'notes', string>>

// Bulk-inserts customers from the CSV import wizard (components/dashboard/
// customer-import-wizard.tsx), which does all header-mapping client-side
// and submits the already-mapped rows as JSON in a hidden field -- this
// action only has to validate and insert. Rows without a name are dropped
// rather than rejecting the whole import; the wizard already warns about
// these before submit, this is the server-side backstop.
//
// Deliberately does NOT default a missing city to 'Vancouver' the way the
// single-customer form does -- that default makes sense for a shop
// manually adding one local customer, but silently stamping it onto every
// row of an unrelated CSV would just be wrong data for anyone whose
// export didn't include a city column.
export async function bulkImportCustomers(
  _prevState: ImportResult | undefined,
  formData: FormData
): Promise<ImportResult> {
  const raw = formData.get('rows_json')
  if (typeof raw !== 'string') return { error: 'No data received.' }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { error: 'Could not read the uploaded data.' }
  }
  if (!Array.isArray(parsed)) return { error: 'Malformed import data.' }

  const candidates = parsed as ImportRow[]
  const toInsert = candidates
    .map((r) => ({
      name: (r.name ?? '').trim(),
      email: r.email?.trim() || null,
      phone: r.phone?.trim() || null,
      address: r.address?.trim() || null,
      city: r.city?.trim() || null,
      notes: r.notes?.trim() || null,
    }))
    .filter((r) => r.name.length > 0)

  const skipped = candidates.length - toInsert.length
  if (toInsert.length === 0) {
    return { error: 'None of the rows had a name mapped -- nothing to import.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('customers').insert(toInsert)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/customers')
  return { imported: toInsert.length, skipped }
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  await supabase.from('customers').delete().eq('id', id)
  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}
