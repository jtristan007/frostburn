'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type CartLine = { pricing_book_item_id: string; description: string; unit_price: number; quantity: number }

// Only a customer this account can see (RLS) -- inserts only check the
// quote's own account_id, so an unchecked id could point at another
// tenant's customer and show their name on the public quote page.
async function ownCustomerId(supabase: Awaited<ReturnType<typeof createClient>>, customerId: string | null) {
  if (!customerId) return null
  const { data } = await supabase.from('customers').select('id').eq('id', customerId).maybeSingle()
  return data?.id ?? null
}

export async function createQuoteFromCart(customerId: string | null, lines: CartLine[]) {
  if (lines.length === 0) throw new Error('Add at least one item before creating a quote.')

  const supabase = await createClient()
  customerId = await ownCustomerId(supabase, customerId)
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

// Sets (or changes) who a quote is for, while it's still a draft.
export async function setQuoteCustomer(id: string, formData: FormData) {
  const supabase = await createClient()
  const customerId = await ownCustomerId(supabase, (formData.get('customer_id') as string) || null)
  if (customerId) {
    await supabase.from('quotes').update({ customer_id: customerId }).eq('id', id).eq('status', 'draft')
  }
  revalidatePath(`/dashboard/quotes/${id}`)
  revalidatePath('/dashboard/quotes')
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

  // A draft isn't ready for the customer even if its link leaked early.
  if (!quote || quote.status === 'draft') return null

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
  // A public endpoint: the type annotation isn't enforced at runtime, so
  // anyone with the link could otherwise set the status to anything.
  if (decision !== 'approved' && decision !== 'declined') redirect(`/quote/${token}`)

  const admin = createAdminClient()
  // Only a 'sent' quote changes, checked in the update itself so two
  // responses racing can't overwrite each other.
  await admin
    .from('quotes')
    .update({ status: decision, responded_at: new Date().toISOString() })
    .eq('share_token', token)
    .eq('status', 'sent')

  redirect(`/quote/${token}`)
}
