import { notFound } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { updateAgreement, deleteAgreement } from '@/app/actions/agreements'
import { CustomerSelect } from '@/components/dashboard/customer-select'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default async function EditAgreementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await getCurrentAccount()
  const [{ data: agreement }, { data: customers }] = await Promise.all([
    supabase.from('agreements').select('*').eq('id', id).maybeSingle(),
    supabase.from('customers').select('id, name').order('name'),
  ])
  if (!agreement) notFound()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Agreement</h1>
      <form
        action={updateAgreement.bind(null, id)}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div>
          <label className={labelClass} htmlFor="customer_id">Customer</label>
          <CustomerSelect customers={customers ?? []} defaultValue={agreement.customer_id} />
        </div>
        <div>
          <label className={labelClass} htmlFor="plan_tier">Plan tier</label>
          <select id="plan_tier" name="plan_tier" defaultValue={agreement.plan_tier} required className={inputClass}>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="unit_count">Unit count</label>
          <input id="unit_count" name="unit_count" type="number" min={1} defaultValue={agreement.unit_count} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="annual_value">Annual value ($)</label>
          <input id="annual_value" name="annual_value" type="number" step="0.01" defaultValue={agreement.annual_value} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="start_date">Start date</label>
          <input id="start_date" name="start_date" type="date" defaultValue={agreement.start_date ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="renewal_date">Renewal date</label>
          <input id="renewal_date" name="renewal_date" type="date" defaultValue={agreement.renewal_date} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="next_service_date">Next service date</label>
          <input id="next_service_date" name="next_service_date" type="date" defaultValue={agreement.next_service_date ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={agreement.status} className={inputClass}>
            <option value="active">Active</option>
            <option value="due">Due</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" name="auto_remind" defaultChecked={agreement.auto_remind} className="rounded border-gray-300" />
          Auto-remind this customer
        </label>
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim transition-colors"
        >
          Save changes
        </button>
      </form>

      <form action={deleteAgreement.bind(null, id)} className="mt-4">
        <button type="submit" className="text-sm text-red-500 hover:text-red-600">
          Delete agreement
        </button>
      </form>
    </div>
  )
}
