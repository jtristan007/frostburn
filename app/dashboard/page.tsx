import { getCurrentAccount } from '@/lib/account'
import { KpiTile } from '@/components/dashboard/kpi-tile'

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default async function DashboardPage() {
  const { supabase, account } = await getCurrentAccount()

  const today = new Date()
  const todayStr = isoDate(today)
  const weekOut = new Date(today)
  weekOut.setDate(weekOut.getDate() + 7)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const [
    overdueInvoices,
    customerCount,
    jobsToday,
    activeAgreements,
    renewingThisMonth,
    servicesDueThisWeek,
    paidInvoices,
  ] = await Promise.all([
    supabase.from('invoices').select('total').eq('status', 'overdue'),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_date', `${todayStr}T00:00:00`)
      .lt('scheduled_date', `${todayStr}T23:59:59`),
    supabase.from('agreements').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase
      .from('agreements')
      .select('id', { count: 'exact', head: true })
      .gte('renewal_date', isoDate(monthStart))
      .lte('renewal_date', isoDate(monthEnd)),
    supabase
      .from('agreements')
      .select('id', { count: 'exact', head: true })
      .gte('next_service_date', todayStr)
      .lte('next_service_date', isoDate(weekOut)),
    supabase
      .from('invoices')
      .select('total, issue_date')
      .eq('status', 'paid')
      .gte('issue_date', isoDate(monthStart))
      .lte('issue_date', isoDate(monthEnd)),
  ])

  const revenueAtRisk = (overdueInvoices.data ?? []).reduce((sum, i) => sum + Number(i.total), 0)
  const mrr = (paidInvoices.data ?? []).reduce((sum, i) => sum + Number(i.total), 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1">Good morning, {account.name}</h1>
      <p className="text-sm text-gray-400 mb-6">
        {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <KpiTile label="Revenue at risk" value={`$${revenueAtRisk.toFixed(0)}`} accent={revenueAtRisk > 0} />
        <KpiTile label="Active clients" value={String(customerCount.count ?? 0)} />
        <KpiTile label="Jobs today" value={String(jobsToday.count ?? 0)} />
        <KpiTile label="This month's revenue" value={`$${mrr.toFixed(0)}`} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KpiTile label="Active agreements" value={String(activeAgreements.count ?? 0)} />
        <KpiTile label="Renewing this month" value={String(renewingThisMonth.count ?? 0)} />
        <KpiTile label="Services due this week" value={String(servicesDueThisWeek.count ?? 0)} />
      </div>
    </div>
  )
}
