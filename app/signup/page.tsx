'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'
import { AuthShell, authInputClass, authLabelClass } from '@/components/auth/auth-shell'

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <AuthShell
      title="Create your account"
      subtitle="30-day free pilot. No credit card required to start."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-ice hover:text-ice-dim">
            Sign in
          </Link>
        </>
      }
    >
      {state && 'message' in state ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4 text-2xl">
            ✉️
          </div>
          <p className="font-semibold text-white mb-1">Check your email</p>
          <p className="text-sm text-mist">{state.message}</p>
        </div>
      ) : (
        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="company_name" className={authLabelClass}>
              Company name
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              autoComplete="organization"
              required
              className={authInputClass}
              placeholder="Henderson HVAC Services"
            />
          </div>

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

          <div>
            <label htmlFor="password" className={authLabelClass}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className={authInputClass}
              placeholder="Min. 6 characters"
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
            {pending ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-xs text-center text-mist">
            By signing up you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-300">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-gray-300">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      )}
    </AuthShell>
  )
}
