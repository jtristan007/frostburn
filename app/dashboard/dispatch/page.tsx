import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'
import { updateFieldStatus, type FieldStatus } from '@/app/actions/jobs'

const FIELD_STATUS_LABELS: Record<FieldStatus, string> = {
  dispatched: 'Dispatched',
  en_route: 'En route',
  arrived: 'Arrived',
}

const FIELD_STATUS_COLORS: Record<FieldStatus, string> = {
  dispatched: 'bg-gray-100 text-gray-600',
  en_route: 'bg-amber/10 text-amber',
  arrived: 'bg-green-50 text-green-700',
}

// The next tap available from a job's current field_status. null means
// "not dispatched yet" -- the first tap available is Dispatch. Once a job
// reaches "arrived," the remaining step is completion, which goes through
// the existing photo/signature capture flow at /jobs/[id]/complete rather
// than another field_status tap.
const NEXT_STATUS: Record<'none' | FieldStatus, FieldStatus | null> = {
  none: 'dispatched',
  dispatched: 'en_route',
  en_route: 'arrived',
  arrived: null,
}

const NEXT_STATUS_LABEL: Record<FieldStatus, string> = {
  dispatched: 'Dispatch',
  en_route: 'Mark en route',
  arrived: 'Mark arrived',
}

export default async function DispatchPage() {
  const { supabase } = await getCurrentAccount()
  const todayStr = new Date().toISOString().slice(0, 10)

  const [{ data: jobs }, { data: technicians }] = await Promise.all([
    supabase
      .from('jobs')
      .select(
        'id, job_type, scheduled_date, status, field_status, assigned_technician_id, customers(name, address, city)'
      )
      .gte('scheduled_date', `${todayStr}T00:00:00`)
      .lt('scheduled_date', `${todayStr}T23:59:59`)
      .order('scheduled_date'),
    supabase.from('account_users').select('user_id, full_name'),
  ])

  const techNameById = new Map((technicians ?? []).map((t) => [t.user_id, t.full_name ?? 'Unnamed']))

  const byTech = new Map<string, typeof jobs>()
  for (const job of jobs ?? []) {
    const key = job.assigned_technician_id ?? 'unassigned'
    if (!byTech.has(key)) byTech.set(key, [])
    byTech.get(key)!.push(job)
  }

  const groups = Array.from(byTech.entries()).map(([techId, techJobs]) => ({
    techId,
    techName: techId === 'unassigned' ? 'Unassigned' : techNameById.get(techId) ?? 'Unknown',
    jobs: techJobs ?? [],
    remaining: (techJobs ?? []).filter((j) => j.status !== 'complete' && j.status !== 'cancelled').length,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Dispatch</h1>
        <p className="text-sm text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 p-6">
          No jobs scheduled today.
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.techId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-navy">{group.techName}</span>
                <span className="text-xs text-gray-400">
                  {group.remaining} job{group.remaining === 1 ? '' : 's'} remaining today
                </span>
              </div>
              <div>
                {group.jobs.map((job) => {
                  const customer = job.customers as unknown as {
                    name: string
                    address: string | null
                    city: string | null
                  } | null
                  const done = job.status === 'complete' || job.status === 'cancelled'
                  const currentKey = (job.field_status ?? 'none') as 'none' | FieldStatus
                  const next = NEXT_STATUS[currentKey]

                  return (
                    <div
                      key={job.id}
                      className={`px-6 py-3.5 border-b border-gray-50 last:border-0 flex items-center justify-between gap-4 ${done ? 'opacity-50' : ''}`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-400">
                            {new Date(job.scheduled_date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-sm font-medium text-navy truncate">
                            {customer?.name ?? '—'}
                          </span>
                          <span className="text-xs text-gray-400 capitalize">{job.job_type}</span>
                        </div>
                        {customer?.address && (
                          <div className="text-xs text-gray-400 mt-0.5 truncate">
                            {customer.address}
                            {customer.city ? `, ${customer.city}` : ''}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {job.field_status && (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${FIELD_STATUS_COLORS[job.field_status as FieldStatus]}`}
                          >
                            {FIELD_STATUS_LABELS[job.field_status as FieldStatus]}
                          </span>
                        )}
                        {done ? (
                          <span className="text-xs text-gray-400 capitalize">{job.status}</span>
                        ) : next ? (
                          <form action={updateFieldStatus.bind(null, job.id, next)}>
                            <button
                              type="submit"
                              className="text-xs font-semibold bg-ice text-navy px-3 py-1.5 rounded-lg hover:bg-ice-dim transition-colors whitespace-nowrap"
                            >
                              {NEXT_STATUS_LABEL[next]}
                            </button>
                          </form>
                        ) : (
                          <Link
                            href={`/dashboard/jobs/${job.id}/complete`}
                            className="text-xs font-semibold bg-navy text-white px-3 py-1.5 rounded-lg hover:bg-navy-mid transition-colors whitespace-nowrap"
                          >
                            Complete job
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
