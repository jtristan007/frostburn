export type CustomerField = 'name' | 'email' | 'phone' | 'address' | 'city' | 'notes'

// What a source column can be mapped to. Several of these fold into one
// customer field when rows are built (first + last name -> name; street 2
// -> address; state + ZIP -> city line), so exports from Jobber, Housecall
// Pro and QuickBooks import without anyone editing the file first.
export type ColumnTarget =
  | 'name'
  | 'first_name'
  | 'last_name'
  | 'company'
  | 'email'
  | 'phone'
  | 'address'
  | 'address2'
  | 'city'
  | 'state'
  | 'zip'
  | 'notes'
  | 'skip'

export const COLUMN_TARGETS: { value: Exclude<ColumnTarget, 'skip'>; label: string }[] = [
  { value: 'name', label: 'Full name' },
  { value: 'first_name', label: 'First name' },
  { value: 'last_name', label: 'Last name' },
  { value: 'company', label: 'Company' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'address', label: 'Street address' },
  { value: 'address2', label: 'Address line 2' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'zip', label: 'ZIP code' },
  { value: 'notes', label: 'Notes' },
]

// First match wins, so specific patterns sit above general ones. Covers the
// headers Jobber documents for clients (First name, Last name, Company
// name, Main/Mobile/Home Phone, Street, City, State, Zip Code, Billing *),
// Housecall Pro's customer export (First Name, Last Name, Mobile Number,
// Company, Address_1 Street Line 1/2, Address_1 City/State/Postal Code,
// Address_1 Billing?), QuickBooks and plain contact spreadsheets.
const GUESS_PATTERNS: [ColumnTarget, RegExp][] = [
  // Yes/no flags, ids and junk columns that would otherwise look like an
  // address or a name ("Address_1 Billing?", "Is Company?", "Fax Phone").
  ['skip', /\?\s*$|fax|^(id|tags?|balance|account balance|archived|lead source|title.*)$/i],
  ['first_name', /^(first|given)[\s_-]*name$/i],
  ['last_name', /^(last|family|sur)[\s_-]*name$/i],
  ['company', /^(company|company[\s_-]*name|organi[sz]ation([\s_-]*name)?|org\.?|business[\s_-]*name)$/i],
  ['name', /^(full[\s_-]*name|display[\s_-]*name|customer([\s_-]*(full[\s_-]*)?name)?|client([\s_-]*name)?|contact[\s_-]*name|name)$/i],
  ['email', /e[\s_-]*mail/i],
  ['phone', /phone|mobile|cell|tel(ephone)?|(work|home|main)[\s_-]*number/i],
  ['zip', /zip|postal/i],
  ['state', /\bstate\b|province/i],
  ['city', /city|town/i],
  ['notes', /note|comment|memo/i],
  ['address2', /(line|street|address)[\s_-]*2|\b(apt|suite|unit)\b/i],
  ['address', /address|street/i],
]

const ADDRESS_PARTS = new Set<ColumnTarget>(['address', 'address2', 'city', 'state', 'zip'])

function guessOne(header: string): ColumnTarget {
  const trimmed = header.trim()
  for (const [field, pattern] of GUESS_PATTERNS) {
    if (pattern.test(trimmed)) return field
  }
  return 'skip'
}

// Guesses every column at once so a file with both a service/property
// address and a billing address keeps the service one (that's where the
// truck goes, and what the dispatch map pins).
export function guessMapping(headers: string[]): ColumnTarget[] {
  const guesses = headers.map(guessOne)
  const isBilling = (h: string) => /billing|bill[\s_-]*to/i.test(h)
  const hasServiceAddress = headers.some((h, i) => ADDRESS_PARTS.has(guesses[i]) && !isBilling(h))
  const kept = guesses.map((g, i) => (hasServiceAddress && ADDRESS_PARTS.has(g) && isBilling(headers[i]) ? 'skip' : g))
  // A combined "Billing address" column (QuickBooks) next to a separate
  // street column would put the city in twice; keep the street column.
  const isStreet = (h: string) => /street|line[\s_-]*1/i.test(h)
  const hasStreet = headers.some((h, i) => kept[i] === 'address' && isStreet(h))
  return kept.map((g, i) => (hasStreet && g === 'address' && !isStreet(headers[i]) ? 'skip' : g))
}

export type MappedCustomer = Record<CustomerField, string>

function cell(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return ''
  return String(value).trim()
}

// Builds one customer from a row. Several columns may share a target (two
// phone columns, Housecall Pro's repeated address sets): the first
// non-empty value wins, except notes, which are joined.
export function buildCustomer(row: unknown[], mapping: ColumnTarget[]): MappedCustomer {
  const first: Partial<Record<ColumnTarget, string>> = {}
  const notes: string[] = []
  mapping.forEach((target, i) => {
    if (target === 'skip') return
    const v = cell(row[i])
    if (!v) return
    if (target === 'notes') notes.push(v)
    else if (!first[target]) first[target] = v
  })

  const person = [first.first_name, first.last_name].filter(Boolean).join(' ')
  const name = first.name || person || first.company || ''
  if (first.company && first.company !== name) notes.unshift(`Company: ${first.company}`)

  let zip = first.zip ?? ''
  // Spreadsheets store ZIPs as numbers and drop the leading zero.
  if (/^\d{4}$/.test(zip)) zip = `0${zip}`
  const stateZip = [first.state, zip].filter(Boolean).join(' ')
  const city = [first.city, stateZip].filter(Boolean).join(', ')

  return {
    name,
    email: (first.email ?? '').split(/[,;]/)[0].trim(),
    phone: first.phone ?? '',
    address: [first.address, first.address2].filter(Boolean).join(' '),
    city,
    notes: notes.join(' · '),
  }
}

export function hasNameSource(mapping: ColumnTarget[]): boolean {
  return mapping.some((t) => t === 'name' || t === 'first_name' || t === 'last_name' || t === 'company')
}
