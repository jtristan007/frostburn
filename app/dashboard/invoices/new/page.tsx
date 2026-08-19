import { getCurrentAccount } from '@/lib/account'
import { createInvoice } from '@/app/actions/invoices'
import { CustomerSelect } from '@/components/dashboard/customer-select'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

function nextInvoiceNumber() {
  return `INV-${Date.now().toString().slice(-6)}`
}

export default async function NewInvoicePage() {
  const { supabase } = await getCurrentAccount()
  const [{ data: customers }, { data: jobs }] = await Promise.all([
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('jobs').select('id, job_type, scheduled_date, customers(name)').order('scheduled_date', { ascending: false }),
  ])

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-6">New Invoice</h1>
      <form action={createInvoice} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className={labelClass} htmlFor="invoice_number">Invoice number</label>
          <input
            id="invoice_number"
            name="invoice_number"
            defaultValue={nextInvoiceNumber()}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="customer_id">Customer</label>
          <CustomerSelect customers={customers ?? []} />
        </div>
        <div>
          <label className={labelClass} htmlFor="job_id">Job (optional)</label>
          <select id="job_id" name="job_id" defaultValue="" className={inputClass}>
            <option value="">No linked job</option>
            {(jobs ?? []).map((j) => (
              <option key={j.id} value={j.id}>
                {(j.customers as unknown as { name: string } | null)?.name} — {j.job_type} (
                {new Date(j.scheduled_date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="total">Total ($)</label>
          <input id="total" name="total" type="number" step="0.01" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="issue_date">Issue date</label>
          <input
            id="issue_date"
            name="issue_date"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="due_date">Due date</label>
          <input id="due_date" name="due_date" type="date" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="draft" className={inputClass}>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim transition-colors"
        >
          Create invoice
        </button>
      </form>
    </div>
  )
}
