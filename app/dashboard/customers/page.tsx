import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'

export default async function CustomersPage() {
  const { supabase } = await getCurrentAccount()
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name, email, phone, city')
    .order('name')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Customers</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/customers/import"
            className="text-sm font-semibold text-navy border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Import CSV
          </Link>
          <Link
            href="/dashboard/customers/new"
            className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
          >
            New Customer
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {(customers ?? []).length === 0 ? (
          <div className="p-8 sm:p-10 text-center">
            <p className="text-base font-semibold text-navy">Bring your customers over</p>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              Export your client list from Jobber, Housecall Pro or QuickBooks and import it here. It takes about a
              minute and nobody gets emailed.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/customers/import"
                className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
              >
                Import customers
              </Link>
              <Link href="/dashboard/customers/new" className="text-sm font-medium text-sky-600 hover:text-navy">
                Or add one by hand
              </Link>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {(customers ?? []).map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/customers/${c.id}`} className="text-navy font-medium hover:text-ice">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-gray-400">{c.email ?? '—'}</td>
                  <td className="px-6 py-3 text-gray-400">{c.phone ?? '—'}</td>
                  <td className="px-6 py-3 text-gray-400">{c.city ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
