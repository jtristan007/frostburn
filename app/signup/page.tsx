'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Logo className="h-9 mx-auto" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-navy">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            30-day free pilot. No credit card required to start.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {state && 'message' in state ? (
            <div className="text-center py-4">
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
                  htmlFor="company_name"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Company name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  autoComplete="organization"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition"
                  placeholder="Henderson HVAC Services"
                />
              </div>

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

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
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
                {pending ? 'Creating account…' : 'Create account'}
              </button>

              <p className="text-xs text-center text-gray-400">
                By signing up you agree to our{' '}
                <Link href="#" className="underline hover:text-gray-600">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="#" className="underline hover:text-gray-600">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
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
