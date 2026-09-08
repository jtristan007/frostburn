import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'

const EVENT_LABELS: Record<string, string> = {
  created: 'Created',
  renewed: 'Renewed',
  cancelled: 'Cancelled',
}

const EVENT_COLORS: Record<string, string> = {
  created: 'bg-ice/10 text-ice-dim',
  renewed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

export default async function RetentionPage() {
  const { supabase } = await getCurrentAccount()
  const { data: events } = await supabase
    .from('agreement_events')
    .select('id, event_type, event_date, annual_value, customers(name)')
    .order('event_date', { ascending: false })
    .limit(100)

  const rows = events ?? []
  const renewed = rows.filter((e) => e.event_type === 'renewed').length
  const cancelled = rows.filter((e) => e.event_type === 'cancelled').length
  const renewalRate = renewed + cancelled > 0 ? Math.round((renewed / (renewed + cancelled)) * 100) : null

  const revenueRetained = rows
    .filter((e) => e.event_type === 'renewed' || e.event_type === 'created')
    .reduce((sum, e) => sum + Number(e.annual_value), 0)
  const revenueLost = rows
    .filter((e) => e.event_type === 'cancelled')
    .reduce((sum, e) => sum + Number(e.annual_value), 0)

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-1">
        <Link href="/dashboard/agreements" className="text-sm text-gray-400 hover:text-navy">
          Agreements
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-navy">Retention</h1>
      </div>
      <p className="text-sm text-gray-400 mb-6">
        Renewal and cancellation history. Builds up as agreements actually renew or lapse — there&apos;s
        nothing to show until that happens for real.
      </p>

      {renewed + cancelled === 0 ? (
        <p className="text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 p-6">
          No renewals or cancellations recorded yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Renewal rate</div>
            <div className="text-2xl font-bold text-navy mt-1">{renewalRate}%</div>
            <div className="text-xs text-gray-400 mt-1">
              {renewed} renewed · {cancelled} cancelled
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Revenue retained</div>
            <div className="text-2xl font-bold text-green-700 mt-1">${revenueRetained.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Revenue lost</div>
            <div className="text-2xl font-bold text-red-600 mt-1">${revenueLost.toLocaleString()}</div>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-3 text-gray-400">{e.event_date}</td>
                  <td className="px-6 py-3 text-navy font-medium">
                    {(e.customers as unknown as { name: string } | null)?.name ?? '—'}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${EVENT_COLORS[e.event_type] ?? ''}`}>
                      {EVENT_LABELS[e.event_type] ?? e.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-gray-400">${Number(e.annual_value).toLocaleString()}/yr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
