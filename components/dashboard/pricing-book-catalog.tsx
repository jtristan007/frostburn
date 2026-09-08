'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createQuoteFromCart, type CartLine } from '@/app/actions/quotes'
import { updatePricingBookItem } from '@/app/actions/pricing-book'

type Item = {
  id: string
  category: string
  name: string
  description: string | null
  price: number
}

const CATEGORY_LABELS: Record<string, string> = {
  heating: 'Heating',
  cooling: 'Cooling',
  indoor_air_quality: 'Indoor Air Quality',
  emergency: 'Emergency',
}

export function PricingBookCatalog({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [pending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const router = useRouter()

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      (i.description ?? '').toLowerCase().includes(query.toLowerCase())
  )

  const byCategory = useMemo(() => {
    const groups: Record<string, Item[]> = {}
    for (const item of filtered) {
      groups[item.category] ??= []
      groups[item.category].push(item)
    }
    return groups
  }, [filtered])

  const cartLines: CartLine[] = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = items.find((i) => i.id === id)!
      return { pricing_book_item_id: id, description: item.name, unit_price: item.price, quantity: qty }
    })
  const cartTotal = cartLines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0)

  function setQty(id: string, qty: number) {
    setCart((c) => ({ ...c, [id]: Math.max(0, qty) }))
  }

  function createQuote() {
    startTransition(async () => {
      await createQuoteFromCart(null, cartLines)
    })
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <input
          type="text"
          placeholder="Search services…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full mb-6 px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice"
        />

        {Object.entries(byCategory).map(([category, catItems]) => (
          <div key={category} className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {CATEGORY_LABELS[category] ?? category}
            </h3>
            <div className="space-y-2">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {editingId === item.id ? (
                      <form
                        action={async (formData) => {
                          await updatePricingBookItem(item.id, formData)
                          setEditingId(null)
                        }}
                        className="flex items-center gap-1"
                      >
                        {/* This item is only ever shown here because the page query already
                            filters to active=true -- always resubmitting 'on' keeps this
                            price-only edit from silently deactivating the item, since
                            updatePricingBookItem writes whatever `active` it's given. */}
                        <input type="hidden" name="active" value="on" />
                        <span className="text-sm text-gray-400">$</span>
                        <input
                          type="number"
                          name="price"
                          step="0.01"
                          min={0}
                          defaultValue={item.price}
                          autoFocus
                          className="w-20 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-ice hover:text-ice-dim px-1.5 py-1"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-xs text-gray-400 hover:text-gray-600 px-1.5 py-1"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingId(item.id)}
                        title="Edit price"
                        className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg text-sm font-semibold text-navy hover:bg-gray-50 hover:text-ice transition-colors group"
                      >
                        ${item.price}
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-gray-300 group-hover:text-ice transition-colors"
                        >
                          <path
                            d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                    <input
                      type="number"
                      min={0}
                      value={cart[item.id] ?? 0}
                      onChange={(e) => setQty(item.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-sm text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-gray-400">No pricing book items yet.</p>
        )}
      </div>

      <div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
          <h3 className="text-sm font-semibold text-navy mb-4">Quote builder</h3>
          {cartLines.length === 0 ? (
            <p className="text-sm text-gray-400">Add items to build a quote.</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {cartLines.map((l) => (
                <li key={l.pricing_book_item_id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {l.quantity} × {l.description}
                  </span>
                  <span className="text-navy font-medium">${(l.unit_price * l.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-3 mb-4">
            <span className="text-navy">Total</span>
            <span className="text-navy">${cartTotal.toFixed(2)}</span>
          </div>
          <button
            type="button"
            disabled={cartLines.length === 0 || pending}
            onClick={createQuote}
            className="w-full py-2.5 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? 'Creating…' : 'Create quote'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/quotes')}
            className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600"
          >
            View all quotes
          </button>
        </div>
      </div>
    </div>
  )
}
