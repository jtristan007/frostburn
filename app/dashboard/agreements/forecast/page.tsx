import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'
import { forecastAgreementVisits } from '@/lib/agreements/forecast'

export default async function CapacityForecastPage() {
  const { supabase } = await getCurrentAccount()
  const { data: agreements } = await supabase
    .from('agreements')
    .select('next_service_date, visits_included_per_year')
    .neq('status', 'expired')

  const months = forecastAgreementVisits(
    (agreements ?? []).map((a) => ({
      nextServiceDate: a.next_service_date,
      visitsIncludedPerYear: a.visits_included_per_year,
    })),
    12
  )

  const max = Math.max(1, ...months.map((m) => m.count))
  const totalAgreements = (agreements ?? []).length

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-1">
        <Link href="/dashboard/agreements" className="text-sm text-gray-400 hover:text-navy">
          Agreements
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-navy">Capacity Forecast</h1>
      </div>
      <p className="text-sm text-gray-400 mb-6">
        Projected included-visit load per month, based on {totalAgreements} active/due agreement
        {totalAgreements === 1 ? '' : 's'} and their cadence. Assumes each keeps renewing on schedule —
        a planning projection, not a guarantee.
      </p>

      {totalAgreements === 0 ? (
        <p className="text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 p-6">
          No active agreements yet — nothing to forecast.
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
          {months.map((m) => (
            <div key={m.month} className="flex items-center gap-4">
              <div className="w-20 shrink-0 text-xs text-gray-400">{m.label}</div>
              <div className="flex-1 h-6 bg-gray-50 rounded-md overflow-hidden">
                <div
                  className="h-full bg-ice rounded-md transition-all"
                  style={{ width: `${(m.count / max) * 100}%` }}
                />
              </div>
              <div className="w-6 shrink-0 text-right text-sm font-medium text-navy">{m.count}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
