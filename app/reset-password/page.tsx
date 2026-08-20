'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { useActionState } from 'react'
import { resetPassword } from '@/app/actions/auth'

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState(resetPassword, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Logo className="h-9 mx-auto" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-navy">
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Must be at least 6 characters
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form action={action} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition"
                placeholder="Min. 6 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Confirm new password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition"
                placeholder="Re-enter password"
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
              {pending ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
