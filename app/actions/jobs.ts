'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function readJobFields(formData: FormData) {
  return {
    customer_id: formData.get('customer_id') as string,
    equipment_id: (formData.get('equipment_id') as string) || null,
    job_type: formData.get('job_type') as string,
    scheduled_date: formData.get('scheduled_date') as string,
    assigned_technician_id: (formData.get('assigned_technician_id') as string) || null,
    status: formData.get('status') as string,
    notes: (formData.get('notes') as string) || null,
  }
}

export async function createJob(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('jobs').insert(readJobFields(formData))
  if (error) throw new Error(error.message)
  redirect('/dashboard/jobs')
}

export async function updateJob(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('jobs').update(readJobFields(formData)).eq('id', id)
  if (error) throw new Error(error.message)
  redirect('/dashboard/jobs')
}

export async function deleteJob(id: string) {
  const supabase = await createClient()
  await supabase.from('jobs').delete().eq('id', id)
  redirect('/dashboard/jobs')
}

// Marking a job complete writes a service_history row when the job is tied
// to a piece of equipment -- closing the loop between scheduling and the
// per-unit service timeline, per the build plan.
export async function completeJob(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: job } = await supabase
    .from('jobs')
    .select('id, customer_id, equipment_id, job_type, notes')
    .eq('id', id)
    .single()

  if (!job) throw new Error('Job not found.')

  await supabase.from('jobs').update({ status: 'complete' }).eq('id', id)

  if (job.equipment_id) {
    await supabase.from('service_history').insert({
      equipment_id: job.equipment_id,
      customer_id: job.customer_id,
      job_id: job.id,
      technician_id: user?.id ?? null,
      work_performed: job.notes || `${job.job_type} completed`,
    })
  }

  revalidatePath('/dashboard/jobs')
  revalidatePath(`/dashboard/customers/${job.customer_id}`)
}
