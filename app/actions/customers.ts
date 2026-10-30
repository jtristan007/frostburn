'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/resend/emails'

type FormState = { error?: string } | undefined

function readCustomerFields(formData: FormData) {
  return {
    name: ((formData.get('name') as string) ?? '').trim(),
    email: ((formData.get('email') as string) ?? '').trim() || null,
    phone: (formData.get('phone') as string) || null,
    address: (formData.get('address') as string) || null,
    city: (formData.get('city') as string)?.trim() || null,
    notes: (formData.get('notes') as string) || null,
  }
}

// Both return { error } for the form to show instead of throwing, which
// used to land the owner on the generic error page with their input lost.
export async function createCustomer(_prev: FormState, formData: FormData): Promise<FormState> {
  const fields = readCustomerFields(formData)
  if (!fields.name) return { error: 'Enter the customer’s name.' }

  const supabase = await createClient()
  const { data, error } = await supabase.from('customers').insert(fields).select('id').single()

  if (error || !data) {
    console.error('Creating customer failed:', error)
    return { error: 'The customer could not be saved. Please try again.' }
  }

  // Only when the owner ticks "Send a welcome email" on the form -- adding a
  // customer to try the product out should never email them by surprise.
  if (fields.email && formData.get('send_welcome') === 'on') {
    const { data: account } = await supabase.from('accounts').select('name').single()
    if (account) {
      await sendWelcomeEmail({
        to: fields.email,
        customerName: fields.name,
        companyName: account.name,
      })
    }
  }

  redirect(`/dashboard/customers/${data.id}`)
}

export async function updateCustomer(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const fields = readCustomerFields(formData)
  if (!fields.name) return { error: 'Enter the customer’s name.' }

  const supabase = await createClient()
  const { error } = await supabase.from('customers').update(fields).eq('id', id)

  if (error) {
    console.error('Updating customer failed:', error)
    return { error: 'The customer could not be saved. Please try again.' }
  }
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
// A missing city is stored as null, same as the single-customer form --
// city is explicitly set on every row so the column's legacy 'Vancouver'
// default never applies.
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
