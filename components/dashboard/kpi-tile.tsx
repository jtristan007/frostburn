import Link from 'next/link'
import type { ReactNode } from 'react'

type Tone = 'ice' | 'green' | 'amber' | 'red' | 'violet' | 'slate'

const TONES: Record<Tone, { chip: string; bar: string }> = {
  ice: { chip: 'bg-sky-50 text-sky-600', bar: 'bg-sky-500' },
  green: { chip: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-500' },
  amber: { chip: 'bg-amber-50 text-amber-600', bar: 'bg-amber-500' },
  red: { chip: 'bg-red-50 text-red-600', bar: 'bg-red-500' },
  violet: { chip: 'bg-violet-50 text-violet-600', bar: 'bg-violet-500' },
  slate: { chip: 'bg-slate-100 text-slate-500', bar: 'bg-slate-400' },
}

// A boxed stat: colored icon chip, label, big number, and an optional
// one-line context underneath. Links through when given an href.
export function KpiTile({
  label,
  value,
  sub,
  icon,
  tone = 'ice',
  alert,
  href,
}: {
  label: string
  value: string
  sub?: string
  icon?: ReactNode
  tone?: Tone
  alert?: boolean
  href?: string
}) {
  const t = TONES[alert ? 'red' : tone]
  const body = (
    <div
      className={`relative h-full overflow-hidden bg-white rounded-2xl border p-4 sm:p-5 shadow-sm transition-shadow ${
        alert ? 'border-red-200' : 'border-gray-100'
      } ${href ? 'hover:shadow-md' : ''}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${t.bar}`} aria-hidden />
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        {icon && (
          <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${t.chip}`} aria-hidden>
            {icon}
          </span>
        )}
      </div>
      <p className={`mt-3 text-2xl sm:text-3xl font-bold tracking-tight ${alert ? 'text-red-600' : 'text-navy'}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  )
  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  )
}

// Small stroke icons for the tiles (24px grid, currentColor).
const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)
export const ICONS = {
  alert: icon('M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'),
  users: icon('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'),
  calendar: icon('M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'),
  dollar: icon('M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'),
  doc: icon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6'),
  refresh: icon('M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5'),
  wrench: icon('M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z'),
}
