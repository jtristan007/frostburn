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
        <Link
          href="/dashboard/customers/new"
          className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
        >
          New Customer
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {(customers ?? []).length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No customers yet.</p>
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
