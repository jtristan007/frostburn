'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updatePricingBookItem(id: string, formData: FormData) {
  const supabase = await createClient()
  const price = Number(formData.get('price'))
  const active = formData.get('active') === 'on'

  await supabase.from('pricing_book_items').update({ price, active }).eq('id', id)
  revalidatePath('/dashboard/pricing-book')
}
