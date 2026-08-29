import Link from 'next/link'
import { getCurrentAccount } from '@/lib/account'

export default async function QuotesPage() {
  const { supabase } = await getCurrentAccount()
  const { data: quotes } = await supabase
    .from('quotes')
    .select('id, status, total, created_at, customers(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Quotes</h1>
        <Link
          href="/dashboard/pricing-book"
          className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
        >
          New Quote
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {(quotes ?? []).length === 0 ? (
          <p className="text-sm text-gray-400 p-6">
            No quotes yet — build one from the{' '}
            <Link href="/dashboard/pricing-book" className="text-ice hover:text-ice-dim">
              pricing book
            </Link>
            .
          </p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {(quotes ?? []).map((q) => (
                <tr key={q.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/quotes/${q.id}`} className="text-navy font-medium hover:text-ice">
                      {(q.customers as unknown as { name: string } | null)?.name ?? 'No customer'}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-gray-400">
                    {new Date(q.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        q.status === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : q.status === 'declined'
                            ? 'bg-red-50 text-red-600'
                            : q.status === 'sent'
                              ? 'bg-ice/10 text-ice-dim'
                              : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-navy font-medium">${q.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
