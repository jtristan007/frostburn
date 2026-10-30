import Link from 'next/link'
import { after } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentAccount } from '@/lib/account'
import { accountTimeZone, dayRangeUtc, todayIn } from '@/lib/tz'
import { updateFieldStatus, type FieldStatus } from '@/app/actions/jobs'
import { partitionByCoordinates, geocodePending, addressLine } from '@/lib/geocode'
import { DispatchMap, type MapJob, type MapStatus } from '@/components/dashboard/dispatch-map'

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
  const { supabase, account } = await getCurrentAccount()
  // "Today" and job times in the shop's own zone, not the server's UTC.
  const tz = accountTimeZone(account)
  const todayStr = todayIn(tz)
  const { start: dayStart, end: dayEnd } = dayRangeUtc(todayStr, tz)

  const [{ data: jobs }, { data: technicians }] = await Promise.all([
    supabase
      .from('jobs')
      .select(
        'id, job_type, scheduled_date, status, field_status, assigned_technician_id, customers(id, name, address, city, latitude, longitude, geocoded_address)'
      )
      .gte('scheduled_date', dayStart)
      .lt('scheduled_date', dayEnd)
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

  type JobCustomer = {
    id: string
    name: string
    address: string | null
    city: string | null
    latitude: number | null
    longitude: number | null
    geocoded_address: string | null
  }
  const customerOf = (job: { customers: unknown }) => job.customers as JobCustomer | null

  // Pins come from saved coordinates only, so the page never waits on a
  // lookup; new or edited addresses are geocoded after the response and
  // show up on the next load.
  const { coords, pending } = partitionByCoordinates(
    (jobs ?? []).map(customerOf).filter((c): c is JobCustomer => c !== null)
  )
  if (pending.length) after(() => geocodePending(createAdminClient(), pending))

  const stopCount = new Map<string, number>()
  const mapJobs: MapJob[] = []
  let unplaced = 0
  for (const job of jobs ?? []) {
    const techId = job.assigned_technician_id ?? 'unassigned'
    const stop = (stopCount.get(techId) ?? 0) + 1
    stopCount.set(techId, stop)
    const customer = customerOf(job)
    const at = customer ? coords.get(customer.id) : undefined
    if (!at) {
      unplaced++
      continue
    }
    const status: MapStatus =
      job.status === 'complete' || job.status === 'cancelled' ? 'done' : ((job.field_status as FieldStatus | null) ?? 'scheduled')
    mapJobs.push({
      id: job.id,
      lat: at.lat,
      lng: at.lng,
      time: new Date(job.scheduled_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }),
      customer: customer?.name ?? 'Customer',
      address: addressLine(customer?.address ?? null, customer?.city ?? null) ?? '',
      jobType: job.job_type ?? 'job',
      techId,
      techName: techId === 'unassigned' ? 'Unassigned' : techNameById.get(techId) ?? 'Unknown',
      status,
      stop,
    })
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
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: tz })}
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 p-6">
          No jobs scheduled today.
        </p>
      ) : (
        <div className="space-y-6">
          {mapJobs.length > 0 && <DispatchMap jobs={mapJobs} unplaced={unplaced} />}
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
                              timeZone: tz,
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
