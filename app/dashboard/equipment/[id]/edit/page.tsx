import { notFound } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { updateEquipment } from '@/app/actions/equipment'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default async function EditEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await getCurrentAccount()
  const { data: eq } = await supabase.from('equipment').select('*').eq('id', id).maybeSingle()
  if (!eq) notFound()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Equipment</h1>
      <form
        action={updateEquipment.bind(null, id, eq.customer_id)}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div>
          <label className={labelClass} htmlFor="unit_type">Unit type</label>
          <input id="unit_type" name="unit_type" defaultValue={eq.unit_type ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="model">Model</label>
          <input id="model" name="model" defaultValue={eq.model ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="serial_number">Serial number</label>
          <input id="serial_number" name="serial_number" defaultValue={eq.serial_number ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="install_date">Install date</label>
          <input id="install_date" name="install_date" type="date" defaultValue={eq.install_date ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="warranty_expiration">Warranty expiration</label>
          <input
            id="warranty_expiration"
            name="warranty_expiration"
            type="date"
            defaultValue={eq.warranty_expiration ?? ''}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="filter_due_date">Filter due date</label>
          <input
            id="filter_due_date"
            name="filter_due_date"
            type="date"
            defaultValue={eq.filter_due_date ?? ''}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim transition-colors"
        >
          Save changes
        </button>
      </form>
    </div>
  )
}
