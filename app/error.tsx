'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-navy mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-400 mb-6">
          We&apos;ve been notified and are looking into it.
        </p>
        <button
          onClick={() => retry()}
          className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
