'use client'

import { useActionState } from 'react'
import { resetPassword } from '@/app/actions/auth'
import { AuthShell, authInputClass, authLabelClass } from '@/components/auth/auth-shell'

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState(resetPassword, undefined)

  return (
    <AuthShell title="Set a new password" subtitle="Must be at least 6 characters">
      <form action={action} className="space-y-5">
        <div>
          <label htmlFor="password" className={authLabelClass}>
            New password
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

        <div>
          <label htmlFor="confirm" className={authLabelClass}>
            Confirm new password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className={authInputClass}
            placeholder="Re-enter password"
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
          {pending ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  )
}
