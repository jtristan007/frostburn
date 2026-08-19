'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function readAgreementFields(formData: FormData) {
  return {
    customer_id: formData.get('customer_id') as string,
    plan_tier: formData.get('plan_tier') as string,
    unit_count: Number(formData.get('unit_count')) || 1,
    annual_value: Number(formData.get('annual_value')),
    start_date: (formData.get('start_date') as string) || null,
    renewal_date: formData.get('renewal_date') as string,
    next_service_date: (formData.get('next_service_date') as string) || null,
    auto_remind: formData.get('auto_remind') === 'on',
    status: formData.get('status') as string,
  }
}

export async function createAgreement(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('agreements').insert(readAgreementFields(formData))
  if (error) throw new Error(error.message)
  redirect('/dashboard/agreements')
}

export async function updateAgreement(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('agreements').update(readAgreementFields(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  redirect('/dashboard/agreements')
}

export async function deleteAgreement(id: string) {
  const supabase = await createClient()
  await supabase.from('agreements').delete().eq('id', id)
  redirect('/dashboard/agreements')
}
