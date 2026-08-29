import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { createEquipment } from '@/app/actions/equipment'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await getCurrentAccount()

  const { data: customer } = await supabase.from('customers').select('*').eq('id', id).maybeSingle()
  if (!customer) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const portalUrl = `${siteUrl}/portal/${customer.portal_token}`

  const { data: equipment } = await supabase
    .from('equipment')
    .select('id, unit_type, model, serial_number, install_date, warranty_expiration, filter_due_date')
    .eq('customer_id', id)
    .order('created_at')

  const { data: history } = await supabase
    .from('service_history')
    .select('id, service_date, work_performed, price')
    .eq('customer_id', id)
    .order('service_date', { ascending: false })
    .limit(20)

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">{customer.name}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {[customer.email, customer.phone, customer.city].filter(Boolean).join(' · ') || 'No contact info'}
          </p>
        </div>
        <Link href={`/dashboard/customers/${id}/edit`} className="text-sm text-ice hover:text-ice-dim">
          Edit
        </Link>
      </div>

      {customer.notes && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 text-sm text-gray-600">
          {customer.notes}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Client portal link — {customer.name} can bookmark this to see every quote and invoice, and
          pay online:
        </p>
        <code className="block text-xs bg-gray-50 rounded-lg px-3 py-2 break-all">{portalUrl}</code>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Equipment</h2>
      <div className="space-y-2 mb-4">
        {(equipment ?? []).map((eq) => {
          const due = eq.filter_due_date && eq.filter_due_date <= today
          return (
            <Link
              key={eq.id}
              href={`/dashboard/equipment/${eq.id}/edit`}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-ice/40 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-navy">
                  {eq.unit_type ?? 'Unit'} {eq.model ? `— ${eq.model}` : ''}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {eq.serial_number ? `S/N ${eq.serial_number}` : ''}
                  {eq.install_date ? ` · installed ${eq.install_date}` : ''}
                </p>
              </div>
              {due && (
                <span className="text-xs font-medium bg-amber/10 text-amber px-2 py-1 rounded-full">
                  Filter due
                </span>
              )}
            </Link>
          )
        })}
        {(equipment ?? []).length === 0 && (
          <p className="text-sm text-gray-400">No equipment on file yet.</p>
        )}
      </div>

      <details className="bg-white rounded-2xl border border-gray-100 p-4 mb-8">
        <summary className="text-sm font-medium text-navy cursor-pointer">Add equipment</summary>
        <form action={createEquipment.bind(null, id)} className="mt-4 grid grid-cols-2 gap-3">
          <input name="unit_type" placeholder="Unit type (e.g. Furnace)" className={inputClass} />
          <input name="model" placeholder="Model" className={inputClass} />
          <input name="serial_number" placeholder="Serial number" className={inputClass} />
          <input name="install_date" type="date" placeholder="Install date" className={inputClass} />
          <input name="warranty_expiration" type="date" placeholder="Warranty expiration" className={inputClass} />
          <input name="filter_due_date" type="date" placeholder="Filter due date" className={inputClass} />
          <button
            type="submit"
            className="col-span-2 py-2 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim transition-colors"
          >
            Add equipment
          </button>
        </form>
      </details>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Service History</h2>
      <div className="space-y-2">
        {(history ?? []).map((h) => (
          <div key={h.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-sm">
            <div className="flex justify-between">
              <span className="text-navy font-medium">{h.service_date}</span>
              {h.price != null && <span className="text-gray-500">${h.price}</span>}
            </div>
            <p className="text-gray-500 mt-1">{h.work_performed}</p>
          </div>
        ))}
        {(history ?? []).length === 0 && (
          <p className="text-sm text-gray-400">No service history yet.</p>
        )}
      </div>
    </div>
  )
}
