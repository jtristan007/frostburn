'use client'

import Link from 'next/link'
import { useState } from 'react'
import { JobsCalendar } from '@/components/dashboard/jobs-calendar'

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-gray-100 text-gray-500',
  'in-progress': 'bg-amber/10 text-amber',
  complete: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

type Job = {
  id: string
  job_type: string
  scheduled_date: string
  status: string
  customerName: string
  technicianName: string | null
}

export function JobsView({ jobs }: { jobs: Job[] }) {
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  return (
    <div>
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setView('calendar')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${view === 'calendar' ? 'bg-navy text-white' : 'text-gray-400 hover:bg-gray-100'}`}
        >
          Calendar
        </button>
        <button
          onClick={() => setView('list')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${view === 'list' ? 'bg-navy text-white' : 'text-gray-400 hover:bg-gray-100'}`}
        >
          List
        </button>
      </div>

      {view === 'calendar' ? (
        <JobsCalendar jobs={jobs} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-400 p-6">No jobs scheduled yet.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-6 py-3">
                      <Link href={`/dashboard/jobs/${j.id}/edit`} className="text-navy font-medium hover:text-ice">
                        {j.customerName}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-gray-400 capitalize">{j.job_type}</td>
                    <td className="px-6 py-3 text-gray-400">{j.technicianName ?? 'Unassigned'}</td>
                    <td className="px-6 py-3 text-gray-400">
                      {new Date(j.scheduled_date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[j.status] ?? ''}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {j.status !== 'complete' && j.status !== 'cancelled' && (
                        <Link
                          href={`/dashboard/jobs/${j.id}/complete`}
                          className="text-xs text-ice hover:text-ice-dim font-medium"
                        >
                          Mark complete
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
