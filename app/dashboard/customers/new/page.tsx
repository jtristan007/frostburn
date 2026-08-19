import { createCustomer } from '@/app/actions/customers'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function NewCustomerPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-navy mb-6">New Customer</h1>
      <form action={createCustomer} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">Name</label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="address">Address</label>
          <input id="address" name="address" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="city">City</label>
          <input id="city" name="city" defaultValue="Vancouver" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={3} className={inputClass} />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim transition-colors"
        >
          Create customer
        </button>
      </form>
    </div>
  )
}
