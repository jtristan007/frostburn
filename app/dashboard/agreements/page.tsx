import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  due: 'bg-amber/10 text-amber',
  expired: 'bg-gray-100 text-gray-500',
}

export default async function AgreementsPage() {
  const { supabase } = await getCurrentAccount()
  const { data: agreements } = await supabase
    .from('agreements')
    .select('id, plan_tier, unit_count, annual_value, renewal_date, status, customers(name)')
    .order('renewal_date')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Maintenance Agreements</h1>
        <Link
          href="/dashboard/agreements/new"
          className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
        >
          New Agreement
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {(agreements ?? []).length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No agreements yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {(agreements ?? []).map((a) => (
                <tr key={a.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/agreements/${a.id}/edit`} className="text-navy font-medium hover:text-ice">
                      {(a.customers as unknown as { name: string } | null)?.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-gray-400 capitalize">{a.plan_tier}</td>
                  <td className="px-6 py-3 text-gray-400">{a.unit_count} unit{a.unit_count === 1 ? '' : 's'}</td>
                  <td className="px-6 py-3 text-gray-400">{a.renewal_date}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[a.status] ?? ''}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-navy font-medium">${a.annual_value}/yr</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
