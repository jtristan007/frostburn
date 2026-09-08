export type ForecastInput = {
  nextServiceDate: string | null // YYYY-MM-DD
  visitsIncludedPerYear: number
}

export type MonthBucket = { month: string; label: string; count: number }

function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// Projects how many agreement-covered visits land in each of the next
// `horizonMonths` calendar months, assuming every agreement keeps renewing
// at its current cadence indefinitely. That's a simplifying assumption --
// this is a staffing-planning projection, not a guarantee any specific
// visit happens. Deliberately visit COUNTS only, not technician-hours:
// jobs have no duration field to estimate from, and inventing one would be
// a guess dressed up as data.
export function forecastAgreementVisits(
  agreements: ForecastInput[],
  horizonMonths = 12,
  today: Date = new Date()
): MonthBucket[] {
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const horizonEnd = new Date(start.getFullYear(), start.getMonth() + horizonMonths, 1)

  const buckets = new Map<string, number>()
  for (let i = 0; i < horizonMonths; i++) {
    buckets.set(monthKey(new Date(start.getFullYear(), start.getMonth() + i, 1)), 0)
  }

  for (const a of agreements) {
    if (!a.nextServiceDate || a.visitsIncludedPerYear <= 0) continue
    const intervalDays = Math.max(Math.round(365 / a.visitsIncludedPerYear), 1)

    let cursor = new Date(`${a.nextServiceDate}T00:00:00`)
    if (Number.isNaN(cursor.getTime())) continue

    // A stale next_service_date shouldn't dump a backlog of "missed"
    // visits into the current month -- fast-forward to the next one on
    // or after today first.
    let guard = 0
    while (cursor < today && guard < 10_000) {
      cursor = addDays(cursor, intervalDays)
      guard++
    }

    while (cursor < horizonEnd) {
      const key = monthKey(cursor)
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1)
      cursor = addDays(cursor, intervalDays)
    }
  }

  return Array.from(buckets.entries()).map(([month, count]) => ({ month, label: monthLabel(month), count }))
}
