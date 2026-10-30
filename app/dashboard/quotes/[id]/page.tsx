import { notFound } from 'next/navigation'
import { getCurrentAccount } from '@/lib/account'
import { sendQuote, setQuoteCustomer } from '@/app/actions/quotes'

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await getCurrentAccount()

  const { data: quote } = await supabase
    .from('quotes')
    .select('id, status, total, share_token, created_at, responded_at, customer_id, customers(name)')
    .eq('id', id)
    .maybeSingle()

  if (!quote) notFound()

  const { data: items } = await supabase
    .from('quote_items')
    .select('description, quantity, unit_price, line_total')
    .eq('quote_id', id)

  const { data: customers } =
    quote.status === 'draft' ? await supabase.from('customers').select('id, name').order('name') : { data: null }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const shareUrl = `${siteUrl}/quote/${quote.share_token}`

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-navy mb-1">
        Quote — {(quote.customers as unknown as { name: string } | null)?.name ?? 'No customer'}
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        {new Date(quote.created_at).toLocaleDateString()} ·{' '}
        <span className="capitalize">{quote.status}</span>
      </p>

      {quote.status === 'draft' && (
        <form
          action={setQuoteCustomer.bind(null, quote.id)}
          className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap items-center gap-3"
        >
          <label htmlFor="customer_id" className="text-sm text-gray-500">
            {quote.customer_id ? 'Customer' : 'Who is this quote for?'}
          </label>
          <select
            id="customer_id"
            name="customer_id"
            defaultValue={quote.customer_id ?? ''}
            required
            className="flex-1 min-w-48 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ice"
          >
            <option value="" disabled>
              Choose a customer…
            </option>
            {(customers ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="text-sm font-semibold border border-gray-200 text-navy px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <ul className="space-y-2 mb-4">
          {(items ?? []).map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity} × {item.description}
              </span>
              <span className="text-navy font-medium">${item.line_total}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-3">
          <span className="text-navy">Total</span>
          <span className="text-navy">${quote.total}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-sm text-gray-500 mb-3">
          Shareable link (no login required to view{quote.status === 'draft' ? '; works once marked as sent' : ''}):
        </p>
        <code className="block text-xs bg-gray-50 rounded-lg px-3 py-2 mb-4 break-all">{shareUrl}</code>
        {quote.status === 'draft' && !quote.customer_id && (
          <p className="text-sm text-gray-500">Choose a customer above before sending this quote.</p>
        )}
        {quote.status === 'draft' && quote.customer_id && (
          <form action={sendQuote.bind(null, quote.id)}>
            <button
              type="submit"
              className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
            >
              Mark as sent
            </button>
          </form>
        )}
        {quote.status === 'sent' && <p className="text-sm text-gray-500 font-medium">Sent — awaiting response</p>}
        {quote.status === 'approved' && (
          <p className="text-sm text-green-700 font-medium">
            Approved ✓{quote.responded_at ? ` — ${new Date(quote.responded_at).toLocaleDateString()}` : ''}
          </p>
        )}
        {quote.status === 'declined' && (
          <p className="text-sm text-red-600 font-medium">
            Declined{quote.responded_at ? ` — ${new Date(quote.responded_at).toLocaleDateString()}` : ''}
          </p>
        )}
      </div>
    </div>
  )
}
