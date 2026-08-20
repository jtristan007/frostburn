import { notFound } from 'next/navigation'
import { getQuoteByToken } from '@/app/actions/quotes'
import { Logo } from '@/components/logo'

export default async function PublicQuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const result = await getQuoteByToken(token)
  if (!result) notFound()

  const { quote, items, customerName } = result

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Logo className="h-9 inline-block" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-xl font-bold text-navy mb-1">
            Quote{customerName ? ` for ${customerName}` : ''}
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            {new Date(quote.created_at).toLocaleDateString()}
          </p>

          <ul className="space-y-2 mb-4">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.quantity} × {item.description}
                </span>
                <span className="text-navy font-medium">${item.line_total}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-base font-semibold border-t border-gray-100 pt-4">
            <span className="text-navy">Total</span>
            <span className="text-navy">${quote.total}</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Questions about this quote? Contact the business that sent it to you.
        </p>
      </div>
    </div>
  )
}
