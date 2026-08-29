'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type CartLine = { pricing_book_item_id: string; description: string; unit_price: number; quantity: number }

export async function createQuoteFromCart(customerId: string | null, lines: CartLine[]) {
  if (lines.length === 0) throw new Error('Add at least one item before creating a quote.')

  const supabase = await createClient()
  const total = lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0)

  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({ customer_id: customerId, total })
    .select('id')
    .single()

  if (error || !quote) throw new Error(error?.message ?? 'Could not create quote.')

  const { error: itemsError } = await supabase.from('quote_items').insert(
    lines.map((l) => ({
      quote_id: quote.id,
      pricing_book_item_id: l.pricing_book_item_id,
      description: l.description,
      unit_price: l.unit_price,
      quantity: l.quantity,
    }))
  )
  if (itemsError) throw new Error(itemsError.message)

  redirect(`/dashboard/quotes/${quote.id}`)
}

export async function sendQuote(id: string) {
  const supabase = await createClient()
  await supabase.from('quotes').update({ status: 'sent' }).eq('id', id)
  revalidatePath(`/dashboard/quotes/${id}`)
}

// Public route (/quote/[token]) has no session, so it fetches via the
// service-role client by token instead of relying on RLS -- the token
// itself is the capability. Only display-safe columns are selected.
export async function getQuoteByToken(token: string) {
  const admin = createAdminClient()
  const { data: quote } = await admin
    .from('quotes')
    .select('id, status, total, created_at, customer_id')
    .eq('share_token', token)
    .maybeSingle()

  if (!quote) return null

  const [{ data: items }, { data: customer }] = await Promise.all([
    admin
      .from('quote_items')
      .select('description, quantity, unit_price, line_total')
      .eq('quote_id', quote.id),
    quote.customer_id
      ? admin.from('customers').select('name').eq('id', quote.customer_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  return { quote, items: items ?? [], customerName: customer?.name ?? null }
}

// Bound as the public pay-page-style form action on /quote/[token] (same
// shape as payInvoice): the customer picks Approve or Decline, no session
// involved, so this re-reads and validates the quote itself rather than
// trusting the caller. Only a 'sent' quote can be responded to -- a draft
// shouldn't be reachable by token yet, and re-deciding an already-answered
// quote would silently overwrite the first answer.
export async function respondToQuote(token: string, decision: 'approved' | 'declined') {
  const admin = createAdminClient()
  const { data: quote } = await admin.from('quotes').select('id, status').eq('share_token', token).maybeSingle()

  if (quote && quote.status === 'sent') {
    await admin
      .from('quotes')
      .update({ status: decision, responded_at: new Date().toISOString() })
      .eq('id', quote.id)
  }

  redirect(`/quote/${token}`)
}
