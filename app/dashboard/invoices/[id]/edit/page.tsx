import { notFound } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { updateInvoice, deleteInvoice } from '@/app/actions/invoices'
import { CustomerSelect } from '@/components/dashboard/customer-select'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await getCurrentAccount()
  const [{ data: invoice }, { data: customers }, { data: jobs }] = await Promise.all([
    supabase.from('invoices').select('*').eq('id', id).maybeSingle(),
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('jobs').select('id, job_type, scheduled_date, customers(name)').order('scheduled_date', { ascending: false }),
  ])
  if (!invoice) notFound()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Invoice</h1>
      <form
        action={updateInvoice.bind(null, id)}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div>
          <label className={labelClass} htmlFor="invoice_number">Invoice number</label>
          <input id="invoice_number" name="invoice_number" defaultValue={invoice.invoice_number} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="customer_id">Customer</label>
          <CustomerSelect customers={customers ?? []} defaultValue={invoice.customer_id} />
        </div>
        <div>
          <label className={labelClass} htmlFor="job_id">Job (optional)</label>
          <select id="job_id" name="job_id" defaultValue={invoice.job_id ?? ''} className={inputClass}>
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
          <input id="total" name="total" type="number" step="0.01" defaultValue={invoice.total} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="issue_date">Issue date</label>
          <input id="issue_date" name="issue_date" type="date" defaultValue={invoice.issue_date} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="due_date">Due date</label>
          <input id="due_date" name="due_date" type="date" defaultValue={invoice.due_date ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={invoice.status} className={inputClass}>
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
          Save changes
        </button>
      </form>

      <form action={deleteInvoice.bind(null, id)} className="mt-4">
        <button type="submit" className="text-sm text-red-500 hover:text-red-600">
          Delete invoice
        </button>
      </form>
    </div>
  )
}
