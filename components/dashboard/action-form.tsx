'use client'

import { startTransition, useActionState, type ReactNode } from 'react'

export type FormState = { error?: string } | undefined

// A form whose server action returns { error } instead of throwing, so a
// failed save (duplicate invoice number, bad value, database error) shows a
// message above the fields rather than the generic error page. Submits via
// onSubmit + startTransition instead of the `action` prop so React doesn't
// reset the fields after a failed attempt -- what the owner typed stays put.
// On success the action redirects as before.
export function ActionForm({
  action,
  className,
  children,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  className?: string
  children: ReactNode
}) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        startTransition(() => formAction(formData))
      }}
    >
      {state?.error && (
        <p role="alert" className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <fieldset disabled={pending} className="min-w-0 space-y-4 disabled:opacity-70">
        {children}
      </fieldset>
    </form>
  )
}
