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
