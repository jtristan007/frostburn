'use client'

import { useEffect, useRef, useState } from 'react'

export type Bucket = { label: string; full: string; revenue: number; count: number }

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`

// Single-series bar chart of revenue collected, monthly or weekly, with a
// hover tooltip per bar and a table view of the same numbers.
export function RevenueChart({ monthly, weekly }: { monthly: Bucket[]; weekly: Bucket[] }) {
  const [range, setRange] = useState<'monthly' | 'weekly'>('monthly')
  const [hover, setHover] = useState<number | null>(null)
  const [showTable, setShowTable] = useState(false)
  const data = range === 'monthly' ? monthly : weekly

  // Draw at the container's real pixel width so text stays 11px on phones.
  const boxRef = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(640)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setW(Math.max(280, Math.round(entry.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const total = data.reduce((s, d) => s + d.revenue, 0)
  const last = data.at(-1)?.revenue ?? 0
  const prev = data.at(-2)?.revenue ?? 0
  const change = prev > 0 ? Math.round(((last - prev) / prev) * 100) : null

  // Nice y-max: round the peak up to a 1/2/5 step so gridlines read cleanly.
  const peak = Math.max(...data.map((d) => d.revenue), 0)
  const step = (() => {
    if (peak <= 0) return 25
    const raw = peak / 4
    const mag = 10 ** Math.floor(Math.log10(raw))
    const n = raw / mag
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag
  })()
  const yMax = step * 4

  const H = 220
  const padL = 60
  const padB = 28
  const padT = 12
  const plotW = W - padL - 8
  const plotH = H - padB - padT
  const slot = plotW / data.length
  const barW = Math.max(6, Math.min(32, slot - 10))
  const y = (v: number) => padT + plotH - (v / yMax) * plotH

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Revenue collected</p>
          <p className="mt-1 text-2xl font-bold text-navy">{fmt(total)}</p>
          <p className="text-xs text-gray-500">
            {range === 'monthly' ? 'Last 6 months' : 'Last 8 weeks'}
            {change !== null && (
              <span className={change >= 0 ? 'text-emerald-600 font-semibold' : 'text-slate-500 font-medium'}>
                {' '}
                · {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% {range === 'monthly' ? 'this month so far vs last month' : 'this week so far vs last week'}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 text-xs font-semibold" role="group" aria-label="Time range">
            {(['monthly', 'weekly'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRange(r)
                  setHover(null)
                }}
                aria-pressed={range === r}
                className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                  range === r ? 'bg-navy text-white' : 'text-gray-500 hover:text-navy'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="text-xs font-semibold text-gray-500 hover:text-navy px-2 py-1.5"
          >
            {showTable ? 'Chart' : 'Table'}
          </button>
        </div>
      </div>

      {showTable ? (
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="py-2 font-medium">{range === 'monthly' ? 'Month' : 'Week of'}</th>
              <th className="py-2 font-medium text-right">Invoices paid</th>
              <th className="py-2 font-medium text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((d) => (
              <tr key={d.full} className="border-b border-gray-50 last:border-0">
                <td className="py-2 text-navy">{d.full}</td>
                <td className="py-2 text-right text-gray-600">{d.count}</td>
                <td className="py-2 text-right font-semibold text-navy">{fmt(d.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div ref={boxRef} className="relative mt-4">
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" role="img" aria-label={`Revenue collected, ${range}`}>
            {[0, 1, 2, 3, 4].map((i) => {
              const v = step * i
              return (
                <g key={i}>
                  <line x1={padL} x2={W - 8} y1={y(v)} y2={y(v)} stroke={i === 0 ? '#cbd5e1' : '#eef2f6'} strokeWidth={1} />
                  <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#64748b">
                    {fmt(v)}
                  </text>
                </g>
              )
            })}
            {data.map((d, i) => {
              // weekly labels get crowded on phones: show every other one
              const showLabel = slot >= 44 || i % 2 === data.length % 2
              const cx = padL + slot * i + slot / 2
              const top = y(d.revenue)
              const h = padT + plotH - top
              const active = hover === i
              return (
                <g key={d.full} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  {/* hit target wider and taller than the bar */}
                  <rect x={padL + slot * i} y={padT} width={slot} height={plotH} fill="transparent" />
                  {d.revenue > 0 && (
                    <path
                      d={`M${cx - barW / 2},${padT + plotH} V${top + 4} q0,-4 4,-4 H${cx + barW / 2 - 4} q4,0 4,4 V${padT + plotH} Z`}
                      fill={active ? '#0369a1' : '#0284c7'}
                    />
                  )}
                  {h <= 0 && <rect x={cx - barW / 2} y={padT + plotH - 2} width={barW} height={2} rx={1} fill="#e2e8f0" />}
                  {(showLabel || active) && (
                    <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill={active ? '#05091a' : '#64748b'}>
                      {d.label}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
          {hover !== null && data[hover] && (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-navy text-white text-xs px-3 py-2 shadow-lg whitespace-nowrap"
              style={{
                left: `${((padL + slot * hover + slot / 2) / W) * 100}%`,
                top: `${(Math.min(y(data[hover].revenue), padT + plotH - 4) / H) * 100}%`,
              }}
            >
              <p className="font-semibold">{data[hover].full}</p>
              <p>
                {fmt(data[hover].revenue)} · {data[hover].count} paid
              </p>
            </div>
          )}
          {total === 0 && (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              No paid invoices yet. Revenue shows up here as customers pay.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
