import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'
import { markInvoicePaid } from '@/app/actions/invoices'

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
    .select('id, invoice_number, status, total, due_date, customers(name)')
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
          <p className="text-sm text-gray-400 p-6">No invoices yet.</p>
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
                      <form action={markInvoicePaid.bind(null, inv.id)}>
                        <button type="submit" className="text-xs text-ice hover:text-ice-dim font-medium">
                          Mark paid
                        </button>
                      </form>
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
