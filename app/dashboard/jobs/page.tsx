import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'
import { accountTimeZone, utcToWallTime } from '@/lib/tz'
import { JobsView } from '@/components/dashboard/jobs-view'

export default async function JobsPage() {
  const { supabase, account } = await getCurrentAccount()
  const tz = accountTimeZone(account)
  const [{ data: jobs }, { data: technicians }] = await Promise.all([
    supabase
      .from('jobs')
      .select('id, job_type, scheduled_date, status, assigned_technician_id, customers(name)')
      .order('scheduled_date', { ascending: false }),
    supabase.from('account_users').select('user_id, full_name'),
  ])

  const techNameById = new Map((technicians ?? []).map((t) => [t.user_id, t.full_name]))

  const rows = (jobs ?? []).map((j) => ({
    id: j.id,
    job_type: j.job_type,
    scheduled_date: j.scheduled_date,
    // Wall-clock time in the shop's zone, so list and calendar show the
    // same time on the server and in any browser.
    localWall: utcToWallTime(j.scheduled_date, tz),
    status: j.status,
    customerName: (j.customers as unknown as { name: string } | null)?.name ?? '—',
    technicianName: j.assigned_technician_id ? techNameById.get(j.assigned_technician_id) ?? null : null,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Jobs</h1>
        <Link
          href="/dashboard/jobs/new"
          className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
        >
          New Job
        </Link>
      </div>

      <JobsView jobs={rows} />
    </div>
  )
}
