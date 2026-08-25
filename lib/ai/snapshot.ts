import type { SupabaseClient } from '@supabase/supabase-js'

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function daysBetween(a: Date, b: Date) {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000)
}

type Named = { customers: { name: string } | { name: string }[] | null }

function customerName(row: Named): string {
  const c = row.customers
  if (!c) return 'Unknown customer'
  return Array.isArray(c) ? c[0]?.name ?? 'Unknown customer' : c.name
}

// Everything the AI assistant is allowed to talk about. Built fresh from the
// account's own real data on every ask -- the assistant is told explicitly
// not to say anything that isn't in here.
export async function buildSnapshot(supabase: SupabaseClient, accountName: string): Promise<string> {
  const today = new Date()
  const todayStr = isoDate(today)
  const weekOut = new Date(today)
  weekOut.setDate(weekOut.getDate() + 7)
  const weekOutStr = isoDate(weekOut)

  const [overdueInvoices, renewingAgreements, jobsToday, filtersDue] = await Promise.all([
    supabase
      .from('invoices')
      .select('invoice_number, total, due_date, customers(name)')
      .eq('status', 'overdue')
      .order('due_date', { ascending: true })
      .limit(15),
    supabase
      .from('agreements')
      .select('plan_tier, annual_value, renewal_date, customers(name)')
      .gte('renewal_date', todayStr)
      .lte('renewal_date', weekOutStr)
      .order('renewal_date', { ascending: true }),
    supabase
      .from('jobs')
      .select('job_type, scheduled_date, status, customers(name)')
      .gte('scheduled_date', `${todayStr}T00:00:00`)
      .lt('scheduled_date', `${todayStr}T23:59:59`)
      .order('scheduled_date', { ascending: true }),
    supabase
      .from('equipment')
      .select('unit_type, filter_due_date, customers(name)')
      .not('filter_due_date', 'is', null)
      .lte('filter_due_date', weekOutStr)
      .order('filter_due_date', { ascending: true })
      .limit(10),
  ])

  const invoices = overdueInvoices.data ?? []
  const revenueAtRisk = invoices.reduce((sum, i) => sum + Number(i.total), 0)

  const lines: string[] = [`Company: ${accountName}. Today: ${today.toDateString()}.`]

  lines.push(`\nOverdue invoices (${invoices.length}, $${revenueAtRisk.toFixed(0)} total at risk):`)
  if (invoices.length === 0) lines.push('- none')
  for (const inv of invoices) {
    const overdueDays = inv.due_date ? daysBetween(today, new Date(inv.due_date)) : null
    lines.push(
      `- ${customerName(inv)}: $${Number(inv.total).toFixed(0)}, invoice ${inv.invoice_number}` +
        (overdueDays !== null ? `, ${overdueDays} days overdue` : '')
    )
  }

  const agreements = renewingAgreements.data ?? []
  lines.push(`\nAgreements renewing in the next 7 days (${agreements.length}):`)
  if (agreements.length === 0) lines.push('- none')
  for (const a of agreements) {
    lines.push(`- ${customerName(a)}: ${a.plan_tier} plan, $${Number(a.annual_value).toFixed(0)}/yr, renews ${a.renewal_date}`)
  }

  const jobs = jobsToday.data ?? []
  lines.push(`\nJobs scheduled today (${jobs.length}):`)
  if (jobs.length === 0) lines.push('- none')
  for (const j of jobs) {
    const time = new Date(j.scheduled_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    lines.push(`- ${time}: ${customerName(j)}, ${j.job_type}, status ${j.status}`)
  }

  const filters = filtersDue.data ?? []
  lines.push(`\nEquipment filters due within 7 days (${filters.length}):`)
  if (filters.length === 0) lines.push('- none')
  for (const f of filters) {
    lines.push(`- ${customerName(f)}: ${f.unit_type ?? 'unit'}, filter due ${f.filter_due_date}`)
  }

  return lines.join('\n')
}
