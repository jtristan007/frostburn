'use client'

import { useSearchParams } from 'next/navigation'

// Shows ?error=... set by the email-link routes (/auth/confirm,
// /auth/callback) so a failed link explains itself instead of silently
// landing on a blank form.
export function LinkError() {
  const error = useSearchParams().get('error')
  if (!error) return null
  return (
    <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3.5 py-2.5 mb-5">
      {error}
    </p>
  )
}
