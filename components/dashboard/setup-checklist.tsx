import Link from 'next/link'

export type SetupStep = {
  key: string
  title: string
  description: string
  done: boolean
  cta: { href: string; label: string }
  secondary?: { href: string; label: string }
}

// "Get set up" card for the dashboard. Every step is derived from the
// account's real data (no stored progress), so it ticks itself off as the
// owner works and disappears once everything is done.
export function SetupChecklist({ steps }: { steps: SetupStep[] }) {
  const doneCount = steps.filter((s) => s.done).length
  if (doneCount === steps.length) return null
  const nextKey = steps.find((s) => !s.done)?.key

  return (
    <section className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-navy">Get Frostburn ready to get you paid</h2>
          <p className="text-sm text-gray-500">A few minutes of setup, then your invoices go out with a Pay now button.</p>
        </div>
        <p className="text-xs font-semibold text-sky-600">
          {doneCount} of {steps.length} done
        </p>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden" aria-hidden>
        <div className="h-full rounded-full bg-sky-500" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
      </div>

      <ol className="mt-5 space-y-3">
        {steps.map((s, i) => {
          const isNext = s.key === nextKey
          return (
            <li
              key={s.key}
              className={`flex gap-3 rounded-xl p-3 ${isNext ? 'bg-sky-50/60 ring-1 ring-sky-100' : ''}`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  s.done ? 'bg-emerald-500 text-white' : isNext ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}
                aria-hidden
              >
                {s.done ? '✓' : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${s.done ? 'text-gray-400 line-through' : 'text-navy'}`}>
                  {s.title}
                  {s.done && <span className="sr-only"> (done)</span>}
                </p>
                {!s.done && (
                  <>
                    <p className="text-sm text-gray-500 mt-0.5">{s.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <Link
                        href={s.cta.href}
                        className={`text-sm font-semibold px-3.5 py-1.5 rounded-lg transition-colors ${
                          isNext
                            ? 'bg-ice text-navy hover:bg-ice-dim'
                            : 'border border-gray-200 text-navy hover:bg-gray-50'
                        }`}
                      >
                        {s.cta.label}
                      </Link>
                      {s.secondary && (
                        <Link href={s.secondary.href} className="text-sm font-medium text-sky-600 hover:text-navy">
                          {s.secondary.label}
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
