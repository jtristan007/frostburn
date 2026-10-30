import { getCurrentAccount } from '@/lib/account'
import { PricingBookCatalog } from '@/components/dashboard/pricing-book-catalog'

export default async function PricingBookPage() {
  const { supabase } = await getCurrentAccount()
  const [{ data: items }, { data: customers }] = await Promise.all([
    supabase
      .from('pricing_book_items')
      .select('id, category, name, description, price')
      .eq('active', true)
      .order('category')
      .order('name'),
    supabase.from('customers').select('id, name').order('name'),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Pricing Book</h1>
      <PricingBookCatalog items={items ?? []} customers={customers ?? []} />
    </div>
  )
}
