'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { forgotPassword } from '@/app/actions/auth'
import { AuthShell, authInputClass, authLabelClass } from '@/components/auth/auth-shell'

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, undefined)

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <>
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-ice hover:text-ice-dim">
            Sign in
          </Link>
        </>
      }
    >
      {state && 'message' in state ? (
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4 text-2xl">
            ✉️
          </div>
          <p className="font-semibold text-white mb-1">Check your email</p>
          <p className="text-sm text-mist">{state.message}</p>
        </div>
      ) : (
        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="email" className={authLabelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={authInputClass}
              placeholder="you@example.com"
            />
          </div>

          {state && 'error' in state && (
            <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3.5 py-2.5">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 px-4 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
