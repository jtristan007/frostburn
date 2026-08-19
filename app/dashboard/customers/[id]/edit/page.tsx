import { notFound } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { updateCustomer, deleteCustomer } from '@/app/actions/customers'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await getCurrentAccount()
  const { data: customer } = await supabase.from('customers').select('*').eq('id', id).maybeSingle()
  if (!customer) notFound()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Customer</h1>
      <form
        action={updateCustomer.bind(null, id)}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div>
          <label className={labelClass} htmlFor="name">Name</label>
          <input id="name" name="name" defaultValue={customer.name} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={customer.email ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" defaultValue={customer.phone ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="address">Address</label>
          <input id="address" name="address" defaultValue={customer.address ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="city">City</label>
          <input id="city" name="city" defaultValue={customer.city ?? ''} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={3} defaultValue={customer.notes ?? ''} className={inputClass} />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim transition-colors"
        >
          Save changes
        </button>
      </form>

      <form action={deleteCustomer.bind(null, id)} className="mt-4">
        <button type="submit" className="text-sm text-red-500 hover:text-red-600">
          Delete customer
        </button>
      </form>
    </div>
  )
}
