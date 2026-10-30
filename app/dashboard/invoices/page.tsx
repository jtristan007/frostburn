import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'
import { markInvoicePaid } from '@/app/actions/invoices'
import { SendInvoicePill } from '@/components/dashboard/send-invoice-pill'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-500',
  sent: 'bg-ice/10 text-ice',
  paid: 'bg-green-50 text-green-700',
  overdue: 'bg-red-50 text-red-600',
}

export default async function InvoicesPage() {
  const { supabase } = await getCurrentAccount()
  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, invoice_number, status, total, due_date, customers(name, email)')
    .order('issue_date', { ascending: false })

  const revenueAtRisk = (invoices ?? [])
    .filter((i) => i.status === 'overdue')
    .reduce((sum, i) => sum + Number(i.total), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-navy">Invoices</h1>
        <Link
          href="/dashboard/invoices/new"
          className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
        >
          New Invoice
        </Link>
      </div>

      {revenueAtRisk > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
          <strong>${revenueAtRisk.toFixed(2)}</strong> in overdue invoices — revenue at risk.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {(invoices ?? []).length === 0 ? (
          <div className="p-8 sm:p-10 text-center">
            <p className="text-base font-semibold text-navy">No invoices yet</p>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              Create an invoice, then email it to your customer from its page. With card payments turned on, it
              includes a Pay now button.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/invoices/new"
                className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
              >
                Create your first invoice
              </Link>
              <Link href="/dashboard/settings/payments" className="text-sm font-medium text-sky-600 hover:text-navy">
                Turn on card payments
              </Link>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {(invoices ?? []).map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/invoices/${inv.id}`} className="text-navy font-medium hover:text-ice">
                      {inv.invoice_number}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-gray-400">
                    {(inv.customers as unknown as { name: string } | null)?.name ?? '—'}
                  </td>
                  <td className="px-6 py-3 text-gray-400">{inv.due_date ?? '—'}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[inv.status] ?? ''}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-navy font-medium">${inv.total}</td>
                  <td className="px-6 py-3 text-right">
                    {inv.status !== 'paid' && (
                      <div className="flex items-center justify-end gap-4">
                        <SendInvoicePill
                          invoiceId={inv.id}
                          customerEmail={(inv.customers as unknown as { email: string | null } | null)?.email ?? null}
                          sent={inv.status === 'sent' || inv.status === 'overdue'}
                        />
                        <form action={markInvoicePaid.bind(null, inv.id)}>
                          <button type="submit" className="text-xs text-ice hover:text-ice-dim font-medium">
                            Mark paid
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
