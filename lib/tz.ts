// Time zones for job scheduling. Job times are stored as real instants
// (timestamptz) but entered and read as wall-clock times in the shop's own
// zone -- accounts.timezone, captured from the owner's browser the first
// time they schedule a job. No date library: Intl does the zone math.
import { countryOf } from '@/lib/money'

export function accountTimeZone(account: { timezone?: string | null; country?: string | null } | null | undefined) {
  const tz = account?.timezone
  if (tz && isValidTimeZone(tz)) return tz
  // Before a zone is captured: Frostburn's shops so far are on the west coast.
  return countryOf(account) === 'CA' ? 'America/Vancouver' : 'America/Los_Angeles'
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

// Offset of `tz` from UTC at the instant `utcMs`, in ms (e.g. -7h for PDT).
function offsetMs(utcMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs))
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return asUtc - Math.floor(utcMs / 1000) * 1000
}

// "2026-10-30T09:00" as a wall-clock time in `tz` -> ISO instant in UTC.
export function wallTimeToUtcIso(local: string, tz: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local)
  if (!m) return null
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])
  // Two passes so a time near a DST change lands on the right offset.
  let utc = guess - offsetMs(guess, tz)
  utc = guess - offsetMs(utc, tz)
  return new Date(utc).toISOString()
}

// ISO instant -> "YYYY-MM-DDTHH:mm" wall-clock in `tz`, for datetime-local inputs.
export function utcToWallTime(iso: string, tz: string): string {
  const ms = Date.parse(iso)
  if (Number.isNaN(ms)) return ''
  return new Date(ms + offsetMs(ms, tz)).toISOString().slice(0, 16)
}

// Today's date in `tz` as "YYYY-MM-DD".
export function todayIn(tz: string, now: Date = new Date()): string {
  return new Date(now.getTime() + offsetMs(now.getTime(), tz)).toISOString().slice(0, 10)
}

// [start, end) of a calendar day in `tz`, as ISO instants for timestamptz filters.
export function dayRangeUtc(dateStr: string, tz: string): { start: string; end: string } {
  const start = wallTimeToUtcIso(`${dateStr}T00:00`, tz)!
  const next = new Date(Date.parse(`${dateStr}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10)
  const end = wallTimeToUtcIso(`${next}T00:00`, tz)!
  return { start, end }
}
