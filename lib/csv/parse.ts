// A small RFC4180-ish CSV parser -- no dependency needed for what this
// product parses (customer exports: quoted fields, embedded commas,
// escaped quotes, CRLF or LF line endings, an optional leading BOM from
// Excel). Deliberately not a full spec implementation (no custom
// delimiters, no multi-line quoted fields spanning more than this loop
// already handles) -- exports from Jobber, Housecall Pro, QuickBooks, and
// Excel/Sheets all fall well within this.
export function parseCsv(text: string): string[][] {
  const clean = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text

  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]

    if (inQuotes) {
      if (char === '"') {
        if (clean[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\r') {
      // swallow -- the \n right after (or a lone \r on old Mac exports)
      // closes the row below
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  // Drop fully-blank trailing rows (a trailing newline in the file
  // otherwise parses as one empty row).
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}
