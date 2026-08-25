'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Job = {
  id: string
  job_type: string
  scheduled_date: string
  status: string
  customerName: string
  technicianName: string | null
}

const STATUS_DOT: Record<string, string> = {
  scheduled: 'bg-gray-300',
  'in-progress': 'bg-amber',
  complete: 'bg-green-500',
  cancelled: 'bg-red-400',
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function monthLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function JobsCalendar({ jobs }: { jobs: Job[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const cells = useMemo(() => {
    const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const startOffset = firstOfMonth.getDay()
    const gridStart = new Date(firstOfMonth)
    gridStart.setDate(gridStart.getDate() - startOffset)

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart)
      date.setDate(gridStart.getDate() + i)
      const dayJobs = jobs
        .filter((j) => sameDay(new Date(j.scheduled_date), date))
        .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
      return { date, inMonth: date.getMonth() === cursor.getMonth(), jobs: dayJobs }
    })
  }, [cursor, jobs])

  const today = new Date()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <p className="text-sm font-semibold text-navy">{monthLabel(cursor)}</p>
        <div className="flex gap-1">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Previous month"
          >
            ←
          </button>
          <button
            onClick={() => setCursor(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
            className="px-3 h-8 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-xs font-semibold text-gray-400 border-b border-gray-100">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-2 py-2 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map(({ date, inMonth, jobs: dayJobs }, i) => (
          <div
            key={i}
            className={`min-h-[92px] border-b border-r border-gray-50 p-1.5 ${inMonth ? '' : 'bg-gray-50/50'}`}
          >
            <p className={`text-xs mb-1 ${sameDay(date, today) ? 'font-bold text-ice' : inMonth ? 'text-gray-500' : 'text-gray-300'}`}>
              {date.getDate()}
            </p>
            <div className="space-y-0.5">
              {dayJobs.slice(0, 3).map((j) => (
                <Link
                  key={j.id}
                  href={`/dashboard/jobs/${j.id}/edit`}
                  className="flex items-center gap-1 text-[11px] text-gray-600 hover:text-ice truncate leading-tight"
                  title={`${j.customerName} — ${j.job_type}${j.technicianName ? ` — ${j.technicianName}` : ''}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[j.status] ?? 'bg-gray-300'}`} />
                  <span className="truncate">{j.customerName}</span>
                </Link>
              ))}
              {dayJobs.length > 3 && <p className="text-[10px] text-gray-400 pl-2.5">+{dayJobs.length - 3} more</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
