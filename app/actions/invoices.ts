'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function readInvoiceFields(formData: FormData) {
  return {
    customer_id: formData.get('customer_id') as string,
    job_id: (formData.get('job_id') as string) || null,
    invoice_number: formData.get('invoice_number') as string,
    status: formData.get('status') as string,
    issue_date: formData.get('issue_date') as string,
    due_date: (formData.get('due_date') as string) || null,
    total: Number(formData.get('total')),
  }
}

export async function createInvoice(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('invoices').insert(readInvoiceFields(formData))
  if (error) throw new Error(error.message)
  redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('invoices').update(readInvoiceFields(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  redirect('/dashboard/invoices')
}

export async function markInvoicePaid(id: string) {
  const supabase = await createClient()
  await supabase.from('invoices').update({ status: 'paid' }).eq('id', id)
  revalidatePath('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()
  await supabase.from('invoices').delete().eq('id', id)
  redirect('/dashboard/invoices')
}
