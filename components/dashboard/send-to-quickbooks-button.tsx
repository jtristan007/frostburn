'use client'

import { useState, useTransition } from 'react'
import { sendInvoiceToQuickBooks } from '@/app/actions/quickbooks'

export function SendToQuickBooksButton({ invoiceId, alreadySent }: { invoiceId: string; alreadySent: boolean }) {
  const [sent, setSent] = useState(alreadySent)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (sent) {
    return <span className="print:hidden text-sm font-medium text-green-700 px-4 py-2">Sent to QuickBooks</span>
  }

  return (
    <div className="print:hidden flex flex-col items-end gap-1">
      <button
        onClick={() =>
          startTransition(async () => {
            setError(null)
            const result = await sendInvoiceToQuickBooks(invoiceId)
            if (result.error) setError(result.error)
            else setSent(true)
          })
        }
        disabled={isPending}
        className="text-sm font-semibold border border-gray-200 text-navy px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Sending…' : 'Send to QuickBooks'}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
