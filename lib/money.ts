// Country an HVAC company operates in, and what that means for money.
// Kept tiny on purpose: two markets, one currency each.
export type Country = 'US' | 'CA'

export const COUNTRY_LABELS: Record<Country, string> = {
  US: 'United States (USD)',
  CA: 'Canada (CAD)',
}

// Tolerates a missing column (rows read before migration 0017 ran) by
// falling back to US, which is how every account was set up before.
export function countryOf(account: { country?: string | null } | null | undefined): Country {
  return account?.country === 'CA' ? 'CA' : 'US'
}

export function parseCountry(value: unknown): Country | null {
  return value === 'US' || value === 'CA' ? value : null
}

export function currencyFor(country: Country): 'usd' | 'cad' {
  return country === 'CA' ? 'cad' : 'usd'
}

// "$1,234.50" for US shops, "$1,234.50 CAD" for Canadian ones -- both use a
// dollar sign, so customer-facing amounts spell out CAD to avoid confusion.
export function formatMoney(amount: number, country: Country): string {
  const n = `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return country === 'CA' ? `${n} CAD` : n
}

// Default GST/HST rate offered on new invoices for Canadian shops: 5% GST,
// which is what BC (and AB, SK, MB, QC for the federal part) charge. HST
// provinces can change it per invoice.
export const DEFAULT_CA_TAX_RATE = 5

export function totalWithTax(subtotal: number, taxRate: number): number {
  return Math.round(subtotal * (1 + taxRate / 100) * 100) / 100
}

export type TaxBreakdown = { subtotal: number; tax: number; rate: number; label: string }

// Subtotal / tax lines for an invoice that was entered with tax, or null for
// one entered as a single total (shown exactly as before).
export function taxBreakdown(invoice: {
  subtotal?: number | string | null
  tax_rate?: number | string | null
  total: number | string
}): TaxBreakdown | null {
  const rate = Number(invoice.tax_rate ?? 0)
  if (invoice.subtotal == null || !(rate > 0)) return null
  const subtotal = Number(invoice.subtotal)
  const tax = Math.round((Number(invoice.total) - subtotal) * 100) / 100
  const pct = `${Number(rate.toFixed(3))}%`
  return { subtotal, tax, rate, label: rate === 5 ? `GST (${pct})` : `GST/HST (${pct})` }
}
