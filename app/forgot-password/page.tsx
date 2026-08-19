'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { forgotPassword } from '@/app/actions/auth'

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPassword, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Frostburn
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-navy">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {state && 'message' in state ? (
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-2xl">
                ✉️
              </div>
              <p className="font-semibold text-navy mb-1">Check your email</p>
              <p className="text-sm text-gray-500">{state.message}</p>
            </div>
          ) : (
            <form action={action} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>

              {state && 'error' in state && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
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
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-semibold text-ice hover:text-ice-dim"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
