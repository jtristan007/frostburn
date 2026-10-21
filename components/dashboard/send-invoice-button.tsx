'use client'

import { useState, useTransition } from 'react'
import { sendInvoiceToCustomer } from '@/app/actions/invoices'

export function SendInvoiceButton({
  invoiceId,
  customerEmail,
  alreadySent,
}: {
  invoiceId: string
  customerEmail: string | null
  alreadySent: boolean
}) {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!customerEmail) {
    return (
      <span className="print:hidden text-xs text-gray-400 self-center">
        Add the customer&apos;s email to send this invoice
      </span>
    )
  }

  return (
    <div className="print:hidden flex flex-col items-end gap-1">
      <button
        onClick={() => {
          if (!confirm(`Email this invoice to ${customerEmail}?`)) return
          startTransition(async () => {
            setError(null)
            const result = await sendInvoiceToCustomer(invoiceId)
            if (result.error) setError(result.error)
            else setSentTo(result.sentTo ?? customerEmail)
          })
        }}
        disabled={isPending}
        className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors disabled:opacity-50"
      >
        {isPending ? 'Sending…' : alreadySent || sentTo ? 'Resend invoice' : 'Send invoice'}
      </button>
      {sentTo && <p className="text-xs text-green-700">Sent to {sentTo}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
