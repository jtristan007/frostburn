'use client'

import { useRef, useState, useTransition } from 'react'
import { inviteTeammate } from '@/app/actions/team'

export function InviteForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function onSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await inviteTeammate(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        formRef.current?.reset()
      }
    })
  }

  return (
    <form ref={formRef} action={onSubmit} className="bg-white rounded-2xl border border-gray-100 p-6">
      <p className="text-sm font-semibold text-navy mb-4">Invite a teammate</p>
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="tech@example.com"
          className="sm:col-span-1 h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-ice"
        />
        <input
          type="text"
          name="full_name"
          placeholder="Name (optional)"
          className="sm:col-span-1 h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-ice"
        />
        <select
          name="role"
          defaultValue="technician"
          className="sm:col-span-1 h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-ice bg-white"
        >
          <option value="technician">Technician</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      {success && <p className="text-sm text-green-700 mt-3">Invite sent.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors disabled:opacity-50"
      >
        {isPending ? 'Sending…' : 'Send invite'}
      </button>
    </form>
  )
}
