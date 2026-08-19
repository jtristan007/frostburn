import { getCurrentAccount } from '@/lib/account'
import { createJob } from '@/app/actions/jobs'
import { CustomerSelect } from '@/components/dashboard/customer-select'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default async function NewJobPage() {
  const { supabase } = await getCurrentAccount()
  const [{ data: customers }, { data: equipment }] = await Promise.all([
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('equipment').select('id, unit_type, model, customers(name)').order('unit_type'),
  ])

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-6">New Job</h1>
      <form action={createJob} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className={labelClass} htmlFor="customer_id">Customer</label>
          <CustomerSelect customers={customers ?? []} />
        </div>
        <div>
          <label className={labelClass} htmlFor="equipment_id">Equipment (optional)</label>
          <select id="equipment_id" name="equipment_id" defaultValue="" className={inputClass}>
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
          <select id="job_type" name="job_type" defaultValue="tune-up" required className={inputClass}>
            <option value="tune-up">Tune-up</option>
            <option value="install">Install</option>
            <option value="emergency">Emergency</option>
            <option value="inspection">Inspection</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="scheduled_date">Scheduled date &amp; time</label>
          <input id="scheduled_date" name="scheduled_date" type="datetime-local" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="scheduled" className={inputClass}>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In progress</option>
            <option value="complete">Complete</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={3} className={inputClass} />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim transition-colors"
        >
          Schedule job
        </button>
      </form>
    </div>
  )
}
