import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPortalByToken } from '@/app/actions/portal'
import { Logo } from '@/components/logo'

const INVOICE_STATUS_STYLE: Record<string, string> = {
  paid: 'bg-green-50 text-green-700',
  overdue: 'bg-red-50 text-red-600',
  sent: 'bg-ice/10 text-ice-dim',
  draft: 'bg-gray-100 text-gray-500',
}

const QUOTE_STATUS_STYLE: Record<string, string> = {
  approved: 'bg-green-50 text-green-700',
  declined: 'bg-gray-100 text-gray-500',
  sent: 'bg-ice/10 text-ice-dim',
  draft: 'bg-gray-100 text-gray-500',
}

export default async function CustomerPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const result = await getPortalByToken(token)
  if (!result) notFound()

  const { customer, companyName, chargesEnabled, invoices, quotes, equipment } = result
  const outstanding = invoices
    .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + Number(inv.total), 0)

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <Logo className="h-9 inline-block" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            {companyName ?? 'Your account'}
          </p>
          <h1 className="text-xl font-bold text-navy mb-4">{customer.name}</h1>

          {outstanding > 0 ? (
            <div className="flex justify-between items-center bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <span className="text-sm text-amber-700 font-medium">Outstanding balance</span>
              <span className="text-lg font-bold text-amber-700">${outstanding.toFixed(2)}</span>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
              No outstanding balance ✓
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Invoices</h2>
          {invoices.length === 0 ? (
            <p className="text-sm text-gray-400">No invoices yet.</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((inv) => {
                const canPay = chargesEnabled && (inv.status === 'sent' || inv.status === 'overdue')
                return (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-navy">{inv.invoice_number}</p>
                      {inv.due_date && <p className="text-xs text-gray-400">Due {inv.due_date}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${INVOICE_STATUS_STYLE[inv.status] ?? 'bg-gray-100 text-gray-500'}`}
                      >
                        {inv.status}
                      </span>
                      <span className="text-sm font-semibold text-navy w-16 text-right">
                        ${Number(inv.total).toFixed(2)}
                      </span>
                      {canPay && (
                        <Link
                          href={`/pay/${inv.pay_token}`}
                          className="text-xs font-semibold bg-ice text-navy px-3 py-1.5 rounded-lg hover:bg-ice-dim transition-colors"
                        >
                          Pay now
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Quotes</h2>
          {quotes.length === 0 ? (
            <p className="text-sm text-gray-400">No quotes yet.</p>
          ) : (
            <div className="space-y-2">
              {quotes.map((q) => (
                <Link
                  key={q.id}
                  href={`/quote/${q.share_token}`}
                  className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:border-ice/40 transition-colors"
                >
                  <p className="text-sm text-gray-500">{new Date(q.created_at).toLocaleDateString()}</p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${QUOTE_STATUS_STYLE[q.status] ?? 'bg-gray-100 text-gray-500'}`}
                    >
                      {q.status}
                    </span>
                    <span className="text-sm font-semibold text-navy w-16 text-right">
                      ${Number(q.total).toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {equipment.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Your equipment</h2>
            <div className="space-y-2">
              {equipment.map((eq) => (
                <div key={eq.id} className="text-sm text-gray-600 border border-gray-100 rounded-xl px-4 py-3">
                  <span className="font-medium text-navy">{eq.unit_type ?? 'Unit'}</span>
                  {eq.model ? ` — ${eq.model}` : ''}
                  {eq.install_date ? ` · installed ${eq.install_date}` : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">
          Questions about your account? Contact {companyName ?? 'the business you work with'}.
        </p>
      </div>
    </div>
  )
}
