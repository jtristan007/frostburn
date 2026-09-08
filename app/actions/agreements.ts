'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// A plain Number(...) || fallback would silently turn an intentional 0 into
// fallback, since 0 is falsy in JS -- matters here because "0 included
// visits" and "$0 standard visit value" are both legitimate inputs.
function parseNonNegative(formData: FormData, key: string, fallback: number): number {
  const raw = formData.get(key)
  const n = raw === null || raw === '' ? NaN : Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

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
    visits_included_per_year: parseNonNegative(formData, 'visits_included_per_year', 2),
    standard_visit_value: parseNonNegative(formData, 'standard_visit_value', 150),
  }
}

export async function createAgreement(formData: FormData) {
  const supabase = await createClient()
  const fields = readAgreementFields(formData)
  const { data, error } = await supabase.from('agreements').insert(fields).select('id').single()
  if (error || !data) throw new Error(error?.message ?? 'Could not create agreement.')

  await supabase.from('agreement_events').insert({
    agreement_id: data.id,
    customer_id: fields.customer_id,
    event_type: 'created',
    annual_value: fields.annual_value,
  })

  redirect('/dashboard/agreements')
}

export async function updateAgreement(id: string, formData: FormData) {
  const supabase = await createClient()
  const fields = readAgreementFields(formData)

  // Fetch the prior status first -- only a genuine active/due -> expired
  // transition is a cancellation worth logging. Without this check, every
  // edit to an already-expired agreement (or re-saving the same status)
  // would log a duplicate cancellation event.
  const { data: existing } = await supabase.from('agreements').select('status').eq('id', id).maybeSingle()

  const { error } = await supabase.from('agreements').update(fields).eq('id', id)
  if (error) throw new Error(error.message)

  if (existing && existing.status !== 'expired' && fields.status === 'expired') {
    await supabase.from('agreement_events').insert({
      agreement_id: id,
      customer_id: fields.customer_id,
      event_type: 'cancelled',
      annual_value: fields.annual_value,
    })
  }

  redirect('/dashboard/agreements')
}

export async function deleteAgreement(id: string) {
  const supabase = await createClient()
  await supabase.from('agreements').delete().eq('id', id)
  redirect('/dashboard/agreements')
}
