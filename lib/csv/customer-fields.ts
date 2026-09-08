export type CustomerField = 'name' | 'email' | 'phone' | 'address' | 'city' | 'notes'
export type ColumnTarget = CustomerField | 'skip'

export const CUSTOMER_FIELDS: { value: CustomerField; label: string; required?: boolean }[] = [
  { value: 'name', label: 'Name', required: true },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'address', label: 'Address' },
  { value: 'city', label: 'City' },
  { value: 'notes', label: 'Notes' },
]

// Heuristics for pre-selecting a mapping so most imports need zero manual
// adjustment -- covers the header names actually used by Jobber, Housecall
// Pro, QuickBooks, and a plain "export contacts" spreadsheet. Order matters:
// first match wins, so more specific patterns (e.g. "billing address")
// should stay above general ones if this list grows.
const GUESS_PATTERNS: [CustomerField, RegExp][] = [
  ['name', /^(full[\s_-]*name|customer[\s_-]*name|client[\s_-]*name|contact[\s_-]*name|name)$/i],
  ['email', /e[\s_-]*mail/i],
  ['phone', /phone|mobile|cell|tel(ephone)?/i],
  ['city', /^city$|^town$/i],
  ['address', /address|street/i],
  ['notes', /note|comment|memo/i],
]

export function guessFieldForHeader(header: string): ColumnTarget {
  const trimmed = header.trim()
  for (const [field, pattern] of GUESS_PATTERNS) {
    if (pattern.test(trimmed)) return field
  }
  return 'skip'
}
