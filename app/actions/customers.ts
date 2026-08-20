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

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  await supabase.from('customers').delete().eq('id', id)
  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}
