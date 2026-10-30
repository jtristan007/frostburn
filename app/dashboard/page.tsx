import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'
import { KpiTile, ICONS } from '@/components/dashboard/kpi-tile'
import { RevenueChart, type Bucket } from '@/components/dashboard/revenue-chart'
import { SetupChecklist, type SetupStep } from '@/components/dashboard/setup-checklist'
import { TRIAL_PERIOD_DAYS } from '@/lib/stripe/plans'

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

const money = (n: number) => `$${Math.round(n).toLocaleString()}`
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Monday of the week containing d (UTC dates, matching how invoice dates are stored).
function weekStart(d: Date) {
  const s = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  s.setUTCDate(s.getUTCDate() - ((s.getUTCDay() + 6) % 7))
  return s
}

const STATUS = [
  { key: 'draft', label: 'Draft', dot: 'bg-slate-400', note: 'not sent yet' },
  { key: 'sent', label: 'Sent', dot: 'bg-sky-500', note: 'waiting on payment' },
  { key: 'overdue', label: 'Overdue', dot: 'bg-red-500', note: 'past due' },
  { key: 'paid', label: 'Paid this month', dot: 'bg-emerald-500', note: 'collected' },
] as const

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>
}) {
  const { checkout } = await searchParams
  const { supabase, account } = await getCurrentAccount()

  const today = new Date()
  const todayStr = isoDate(today)
  const weekOut = new Date(today)
  weekOut.setDate(weekOut.getDate() + 7)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const sixMonthsAgo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 5, 1))

  const [
    openInvoices,
    paidInvoices,
    customerCount,
    jobsToday,
    activeAgreements,
    renewingThisMonth,
    servicesDueThisWeek,
    deliveredInvoices,
  ] = await Promise.all([
      supabase.from('invoices').select('status, total').in('status', ['draft', 'sent', 'overdue']),
      supabase
        .from('invoices')
        .select('total, issue_date, paid_at')
        .eq('status', 'paid')
        .or(`paid_at.gte.${isoDate(sixMonthsAgo)},and(paid_at.is.null,issue_date.gte.${isoDate(sixMonthsAgo)})`),
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
      // Any invoice that has left draft -- emailed, or recorded as paid.
      supabase.from('invoices').select('id', { count: 'exact', head: true }).neq('status', 'draft'),
    ])

  const hasCustomers = (customerCount.count ?? 0) > 0
  const setupSteps: SetupStep[] = [
    {
      key: 'customers',
      title: 'Bring in your customers',
      description: 'Import your list from Jobber, Housecall Pro or QuickBooks in about a minute, or add them one at a time.',
      done: hasCustomers,
      cta: { href: '/dashboard/customers/import', label: 'Import customers' },
      secondary: { href: '/dashboard/customers/new', label: 'Add one customer' },
    },
    {
      key: 'payments',
      title: 'Turn on card payments',
      description: 'Connect Stripe so every invoice you send has a Pay now button. Money goes straight to your bank.',
      done: !!account.stripe_connect_charges_enabled,
      cta: { href: '/dashboard/settings/payments', label: 'Connect payments' },
    },
    {
      key: 'invoice',
      title: 'Send your first invoice',
      description: hasCustomers
        ? 'Create an invoice and email it to your customer straight from Frostburn.'
        : 'Once you have a customer, create an invoice and email it straight from Frostburn.',
      done: (deliveredInvoices.count ?? 0) > 0,
      cta: { href: '/dashboard/invoices/new', label: 'Create an invoice' },
    },
    {
      key: 'plan',
      title: `Start your ${TRIAL_PERIOD_DAYS}-day free trial`,
      description: 'Pick a plan to unlock inviting your techs. No credit card required to start.',
      done: !!account.tier,
      cta: { href: '/onboarding/plan', label: 'Choose a plan' },
    },
  ]

  // Paid revenue lands on the day it was paid (issue date for invoices marked
  // paid by hand before paid_at existed).
  const paid = (paidInvoices.data ?? []).map((i) => ({
    total: Number(i.total),
    date: new Date(`${(i.paid_at ?? i.issue_date).slice(0, 10)}T00:00:00Z`),
  }))

  const monthly: Bucket[] = Array.from({ length: 6 }, (_, k) => {
    const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 5 + k, 1))
    const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1))
    const inRange = paid.filter((p) => p.date >= start && p.date < end)
    return {
      label: MONTHS.at(start.getUTCMonth()) ?? '',
      full: `${MONTHS.at(start.getUTCMonth())} ${start.getUTCFullYear()}`,
      revenue: inRange.reduce((s, p) => s + p.total, 0),
      count: inRange.length,
    }
  })

  const thisWeek = weekStart(today)
  const weekly: Bucket[] = Array.from({ length: 8 }, (_, k) => {
    const start = new Date(thisWeek)
    start.setUTCDate(start.getUTCDate() - 7 * (7 - k))
    const end = new Date(start)
    end.setUTCDate(end.getUTCDate() + 7)
    const inRange = paid.filter((p) => p.date >= start && p.date < end)
    const label = `${MONTHS.at(start.getUTCMonth())} ${start.getUTCDate()}`
    return { label, full: `Week of ${label}`, revenue: inRange.reduce((s, p) => s + p.total, 0), count: inRange.length }
  })

  const open = openInvoices.data ?? []
  const byStatus = (s: string) => open.filter((i) => i.status === s)
  const sum = (rows: { total: unknown }[]) => rows.reduce((s, i) => s + Number(i.total), 0)
  const overdue = byStatus('overdue')
  const revenueAtRisk = sum(overdue)
  const thisMonth = monthly.at(-1) ?? { revenue: 0, count: 0 }
  const lastMonth = monthly.at(-2) ?? { revenue: 0, count: 0 }

  const statusRows = STATUS.map((s) =>
    s.key === 'paid'
      ? { ...s, count: thisMonth.count, amount: thisMonth.revenue }
      : { ...s, count: byStatus(s.key).length, amount: sum(byStatus(s.key)) }
  )
  const statusMax = Math.max(...statusRows.map((r) => r.amount), 1)


  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">
            {hasCustomers ? 'Welcome back' : 'Welcome to Frostburn'}, {account.name}
          </h1>
          <p className="text-sm text-gray-500">
            {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
        >
          + New invoice
        </Link>
      </div>

      {checkout === 'success' && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-6 text-sm text-emerald-800">
          You&apos;re all set — your {TRIAL_PERIOD_DAYS}-day free trial has started.
        </div>
      )}

      <SetupChecklist steps={setupSteps} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <KpiTile
          label="Revenue at risk"
          value={money(revenueAtRisk)}
          sub={overdue.length ? `${overdue.length} overdue invoice${overdue.length === 1 ? '' : 's'}` : 'Nothing overdue'}
          icon={ICONS.alert}
          tone="green"
          alert={revenueAtRisk > 0}
          href="/dashboard/invoices"
        />
        <KpiTile
          label="This month's revenue"
          value={money(thisMonth.revenue)}
          sub={`${money(lastMonth.revenue)} last month`}
          icon={ICONS.dollar}
          tone="green"
        />
        <KpiTile
          label="Jobs today"
          value={String(jobsToday.count ?? 0)}
          sub="On the schedule"
          icon={ICONS.calendar}
          tone="ice"
          href="/dashboard/jobs"
        />
        <KpiTile
          label="Active clients"
          value={String(customerCount.count ?? 0)}
          sub="In your customer list"
          icon={ICONS.users}
          tone="violet"
          href="/dashboard/customers"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <RevenueChart monthly={monthly} weekly={weekly} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoices</p>
            <Link href="/dashboard/invoices" className="text-xs font-semibold text-sky-600 hover:text-navy">
              View all →
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {statusRows.map((r) => (
              <li key={r.key}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-navy">
                    <span className={`w-2.5 h-2.5 rounded-full ${r.dot}`} aria-hidden />
                    {r.label}
                  </span>
                  <span className="font-semibold text-navy">{money(r.amount)}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${r.dot}`} style={{ width: `${(r.amount / statusMax) * 100}%` }} />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {r.count} invoice{r.count === 1 ? '' : 's'} · {r.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <KpiTile
          label="Active agreements"
          value={String(activeAgreements.count ?? 0)}
          sub="Maintenance plans"
          icon={ICONS.doc}
          tone="ice"
          href="/dashboard/agreements"
        />
        <KpiTile
          label="Renewing this month"
          value={String(renewingThisMonth.count ?? 0)}
          sub="Agreements up for renewal"
          icon={ICONS.refresh}
          tone="amber"
          href="/dashboard/agreements"
        />
        <KpiTile
          label="Services due this week"
          value={String(servicesDueThisWeek.count ?? 0)}
          sub="Maintenance visits to book"
          icon={ICONS.wrench}
          tone="violet"
          href="/dashboard/agreements"
        />
      </div>
    </div>
  )
}
