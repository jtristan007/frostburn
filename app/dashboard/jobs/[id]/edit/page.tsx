import { notFound } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { updateJob, deleteJob } from '@/app/actions/jobs'
import { CustomerSelect } from '@/components/dashboard/customer-select'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await getCurrentAccount()
  const [{ data: job }, { data: customers }, { data: equipment }, { data: technicians }] = await Promise.all([
    supabase.from('jobs').select('*').eq('id', id).maybeSingle(),
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('equipment').select('id, unit_type, model, customers(name)').order('unit_type'),
    supabase.from('account_users').select('user_id, full_name'),
  ])
  if (!job) notFound()

  const scheduledLocal = job.scheduled_date ? job.scheduled_date.slice(0, 16) : ''

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Job</h1>
      <form action={updateJob.bind(null, id)} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className={labelClass} htmlFor="customer_id">Customer</label>
          <CustomerSelect customers={customers ?? []} defaultValue={job.customer_id} />
        </div>
        <div>
          <label className={labelClass} htmlFor="equipment_id">Equipment (optional)</label>
          <select id="equipment_id" name="equipment_id" defaultValue={job.equipment_id ?? ''} className={inputClass}>
            <option value="">No specific unit</option>
            {(equipment ?? []).map((eq) => (
              <option key={eq.id} value={eq.id}>
                {(eq.customers as unknown as { name: string } | null)?.name} — {eq.unit_type ?? 'Unit'}{' '}
                {eq.model ? `(${eq.model})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="job_type">Job type</label>
          <select id="job_type" name="job_type" defaultValue={job.job_type} required className={inputClass}>
            <option value="tune-up">Tune-up</option>
            <option value="install">Install</option>
            <option value="emergency">Emergency</option>
            <option value="inspection">Inspection</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="scheduled_date">Scheduled date &amp; time</label>
          <input
            id="scheduled_date"
            name="scheduled_date"
            type="datetime-local"
            defaultValue={scheduledLocal}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="assigned_technician_id">Assigned technician</label>
          <select
            id="assigned_technician_id"
            name="assigned_technician_id"
            defaultValue={job.assigned_technician_id ?? ''}
            className={inputClass}
          >
            <option value="">Unassigned</option>
            {(technicians ?? []).map((t) => (
              <option key={t.user_id} value={t.user_id}>
                {t.full_name ?? t.user_id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={job.status} className={inputClass}>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In progress</option>
            <option value="complete">Complete</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={3} defaultValue={job.notes ?? ''} className={inputClass} />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim transition-colors"
        >
          Save changes
        </button>
      </form>

      <form action={deleteJob.bind(null, id)} className="mt-4">
        <button type="submit" className="text-sm text-red-500 hover:text-red-600">
          Delete job
        </button>
      </form>
    </div>
  )
}
