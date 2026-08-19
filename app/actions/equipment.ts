'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createEquipment(customerId: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('equipment').insert({
    customer_id: customerId,
    unit_type: (formData.get('unit_type') as string) || null,
    model: (formData.get('model') as string) || null,
    serial_number: (formData.get('serial_number') as string) || null,
    install_date: (formData.get('install_date') as string) || null,
    warranty_expiration: (formData.get('warranty_expiration') as string) || null,
    filter_due_date: (formData.get('filter_due_date') as string) || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/customers/${customerId}`)
}

export async function updateEquipment(id: string, customerId: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('equipment')
    .update({
      unit_type: (formData.get('unit_type') as string) || null,
      model: (formData.get('model') as string) || null,
      serial_number: (formData.get('serial_number') as string) || null,
      install_date: (formData.get('install_date') as string) || null,
      warranty_expiration: (formData.get('warranty_expiration') as string) || null,
      filter_due_date: (formData.get('filter_due_date') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  redirect(`/dashboard/customers/${customerId}`)
}
