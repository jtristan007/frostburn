import { notFound } from 'next/navigation'
import { getInvoiceByToken, payInvoice } from '@/app/actions/invoices'
import { Logo } from '@/components/logo'

export default async function PayInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ paid?: string; error?: string }>
}) {
  const { token } = await params
  const { paid, error } = await searchParams
  const result = await getInvoiceByToken(token)
  if (!result) notFound()

  const { invoice, companyName, customerName } = result
  const isPaid = paid === '1' || invoice.status === 'paid'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Logo className="h-9 inline-block" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            {companyName ?? 'Invoice'}
          </p>
          <h1 className="text-xl font-bold text-navy mb-1">
            Invoice {invoice.invoice_number}
            {customerName ? ` — ${customerName}` : ''}
          </h1>

          <div className="flex justify-between text-base font-semibold border-t border-gray-100 mt-4 pt-4">
            <span className="text-navy">Total due</span>
            <span className="text-navy">${Number(invoice.total).toFixed(2)}</span>
          </div>

          {isPaid ? (
            <div className="mt-6 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
              Paid ✓ — thank you.
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-6 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <form action={payInvoice.bind(null, token)} className="mt-6">
                <button
                  type="submit"
                  className="w-full text-sm font-semibold bg-ice text-navy px-4 py-3 rounded-lg hover:bg-ice-dim transition-colors"
                >
                  Pay now
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Questions about this invoice? Contact {companyName ?? 'the business that sent it to you'}.
        </p>
      </div>
    </div>
  )
}
