'use client'

import { useState, useTransition } from 'react'
import { sendInvoiceToCustomer } from '@/app/actions/invoices'

// Compact Send control for the invoices list: glows red while the invoice
// has never been emailed, green once it has. Clicking a green one resends.
export function SendInvoicePill({
  invoiceId,
  customerEmail,
  sent,
}: {
  invoiceId: string
  customerEmail: string | null
  sent: boolean
}) {
  const [isSent, setIsSent] = useState(sent)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!customerEmail) {
    return (
      <span
        className="text-xs font-medium px-3 py-1 rounded-full border border-gray-200 text-gray-400"
        title="Add an email address to this customer to send invoices"
      >
        No email
      </span>
    )
  }

  const tone = isSent
    ? 'border-green-400 text-green-700 bg-green-50 shadow-[0_0_10px_rgba(34,197,94,0.55)] hover:bg-green-100'
    : 'border-red-400 text-red-600 bg-red-50 shadow-[0_0_10px_rgba(239,68,68,0.55)] hover:bg-red-100'

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={() => {
          const verb = isSent ? 'Resend' : 'Send'
          if (!confirm(`${verb} this invoice to ${customerEmail}?`)) return
          startTransition(async () => {
            setError(null)
            const result = await sendInvoiceToCustomer(invoiceId)
            if (result.error) setError(result.error)
            else setIsSent(true)
          })
        }}
        disabled={isPending}
        title={isSent ? `Sent to ${customerEmail}. Click to resend.` : `Not sent yet. Email it to ${customerEmail}.`}
        className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors disabled:opacity-50 ${tone}`}
      >
        {isPending ? 'Sending…' : isSent ? 'Sent ✓' : 'Send invoice'}
      </button>
      {error && <span className="mt-1 text-[11px] text-red-600 max-w-[12rem] text-right">{error}</span>}
    </span>
  )
}
