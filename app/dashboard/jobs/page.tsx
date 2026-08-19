import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'
import { completeJob } from '@/app/actions/jobs'

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-gray-100 text-gray-500',
  'in-progress': 'bg-amber/10 text-amber',
  complete: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

export default async function JobsPage() {
  const { supabase } = await getCurrentAccount()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, job_type, scheduled_date, status, customers(name)')
    .order('scheduled_date', { ascending: false })

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

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {(jobs ?? []).length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No jobs scheduled yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {(jobs ?? []).map((j) => (
                <tr key={j.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/jobs/${j.id}/edit`} className="text-navy font-medium hover:text-ice">
                      {(j.customers as unknown as { name: string } | null)?.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-gray-400 capitalize">{j.job_type}</td>
                  <td className="px-6 py-3 text-gray-400">
                    {new Date(j.scheduled_date).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[j.status] ?? ''}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {j.status !== 'complete' && j.status !== 'cancelled' && (
                      <form action={completeJob.bind(null, j.id)}>
                        <button type="submit" className="text-xs text-ice hover:text-ice-dim font-medium">
                          Mark complete
                        </button>
                      </form>
                    )}
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
