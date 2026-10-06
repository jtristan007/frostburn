import { PAST_DUE_GRACE_DAYS } from '@/lib/stripe/plans'

// Null once there's no active dunning clock (past_due_since unset) or the
// grace period has fully elapsed and the caller should lock the dashboard,
// otherwise the number of days left to show in the warning banner.
export function pastDueDaysLeft(pastDueSince: string | null): number | null {
  if (!pastDueSince) return null
  const elapsedDays = (Date.now() - new Date(pastDueSince).getTime()) / (1000 * 60 * 60 * 24)
  const daysLeft = Math.ceil(PAST_DUE_GRACE_DAYS - elapsedDays)
  return daysLeft > 0 ? daysLeft : 0
}
