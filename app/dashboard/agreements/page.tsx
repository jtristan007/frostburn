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
    .select(
      'id, plan_tier, unit_count, annual_value, renewal_date, status, visits_included_per_year, visits_completed_this_period, standard_visit_value, customers(name)'
    )
    .order('renewal_date')

  const activeAgreements = (agreements ?? []).filter((a) => a.status !== 'expired')
  const recurringRevenue = activeAgreements.reduce((sum, a) => sum + Number(a.annual_value), 0)
  const retailValue = activeAgreements.reduce(
    (sum, a) => sum + a.visits_included_per_year * Number(a.standard_visit_value),
    0
  )

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

      {activeAgreements.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Active agreements</div>
            <div className="text-2xl font-bold text-navy mt-1">{activeAgreements.length}</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Recurring revenue / yr</div>
            <div className="text-2xl font-bold text-navy mt-1">${recurringRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Retail-equivalent value / yr</div>
            <div className="text-2xl font-bold text-navy mt-1">${retailValue.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">what these visits would cost billed individually</div>
          </div>
        </div>
      )}

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
                  <td className="px-6 py-3 text-gray-400">
                    {a.visits_completed_this_period} / {a.visits_included_per_year} visits
                  </td>
                  <td className="px-6 py-3 text-right text-navy font-medium">${a.annual_value}/yr</td>
                  <td className="px-6 py-3 text-right">
                    {(() => {
                      const retail = a.visits_included_per_year * Number(a.standard_visit_value)
                      const diff = retail - Number(a.annual_value)
                      if (a.visits_included_per_year === 0) return <span className="text-gray-300 text-xs">—</span>
                      return diff >= 0 ? (
                        <span className="text-green-600 text-xs font-medium">
                          customer saves ${diff.toLocaleString()}/yr
                        </span>
                      ) : (
                        <span className="text-amber text-xs font-medium">
                          ${Math.abs(diff).toLocaleString()}/yr above retail
                        </span>
                      )
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
