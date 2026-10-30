'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { bulkImportCustomers, type ImportResult } from '@/app/actions/customers'
import { parseCsv } from '@/lib/csv/parse'
import { COLUMN_TARGETS, buildCustomer, guessMapping, hasNameSource, type ColumnTarget } from '@/lib/csv/customer-fields'

type Step = 'upload' | 'map' | 'review'

type ParsedFile = {
  fileName: string
  headers: string[]
  rows: string[][]
}

// Export steps from each app's own help docs (Jobber: "Export Client
// Information"; Housecall Pro customer list download). Re-check if the
// apps change their menus.
const EXPORT_HELP = [
  { app: 'Jobber', steps: 'Clients → More Actions → Export Clients → CSV. Jobber emails you the file.' },
  { app: 'Housecall Pro', steps: 'Customers → More → Download customer list. Housecall Pro emails you an Excel file.' },
  { app: 'QuickBooks', steps: 'Open your customer list and choose Export to Excel, then upload that file.' },
]

const STEPS: { key: Step; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'map', label: 'Map columns' },
  { key: 'review', label: 'Review & import' },
]

function sampleValues(rows: string[][], colIndex: number, max = 3): string[] {
  const seen = new Set<string>()
  for (const row of rows) {
    const v = (row[colIndex] ?? '').trim()
    if (v && !seen.has(v)) seen.add(v)
    if (seen.size >= max) break
  }
  return Array.from(seen)
}

// Up to 500 rows per request, and fewer when rows are large (long notes),
// keeping each request well under the 1 MB server-action body limit.
const IMPORT_BATCH_ROWS = 500
const IMPORT_BATCH_BYTES = 600_000

function toBatches<T>(rows: T[]): T[][] {
  const encoder = new TextEncoder()
  const batches: T[][] = []
  let current: T[] = []
  let bytes = 0
  for (const row of rows) {
    const size = encoder.encode(JSON.stringify(row)).length
    if (current.length > 0 && (current.length >= IMPORT_BATCH_ROWS || bytes + size > IMPORT_BATCH_BYTES)) {
      batches.push(current)
      current = []
      bytes = 0
    }
    current.push(row)
    bytes += size
  }
  if (current.length > 0) batches.push(current)
  return batches
}

export function CustomerImportWizard() {
  const [step, setStep] = useState<Step>('upload')
  const [parsed, setParsed] = useState<ParsedFile | null>(null)
  const [mapping, setMapping] = useState<ColumnTarget[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [result, setResult] = useState<ImportResult | undefined>(undefined)
  const [pending, setPending] = useState(false)
  const [progress, setProgress] = useState(0)

  const stepIndex = STEPS.findIndex((s) => s.key === step)

  // Sends the rows in batches: a server action's request body is capped
  // (1 MB by default), and a full Jobber or Housecall Pro export can be
  // bigger than that in one go. Batches run in order; if one fails, the
  // message says how many were already imported so nothing gets re-added
  // blindly.
  async function runImport() {
    setPending(true)
    setResult(undefined)
    setProgress(0)
    let imported = 0
    let skipped = 0
    try {
      const rows = readyRows.map((r) => ({
        name: r.name,
        email: r.email,
        phone: r.phone,
        address: r.address,
        city: r.city,
        notes: r.notes,
      }))
      for (const batch of toBatches(rows)) {
        const fd = new FormData()
        fd.set('rows_json', JSON.stringify(batch))
        const res = await bulkImportCustomers(undefined, fd)
        if ('error' in res) {
          setResult({ error: imported > 0 ? `${res.error} (${imported} customers were imported before this error.)` : res.error })
          return
        }
        imported += res.imported
        skipped += res.skipped
        setProgress(imported)
      }
      setResult({ imported, skipped })
    } catch {
      setResult({
        error:
          imported > 0
            ? `The import stopped partway. ${imported} customers were imported -- check your customer list before trying again.`
            : 'The import could not be completed. Please try again.',
      })
    } finally {
      setPending(false)
    }
  }

  function loadTable(fileName: string, table: string[][]) {
    const rows = table.filter((r) => r.some((c) => c.trim()))
    if (rows.length < 2) {
      setFileError('That file needs a header row plus at least one customer row.')
      return
    }
    const [headerRow, ...dataRows] = rows
    const headers = headerRow.map((h) => h.trim() || '(blank)')
    setParsed({ fileName, headers, rows: dataRows })
    setMapping(guessMapping(headers))
    setStep('map')
  }

  async function handleFile(file: File) {
    setFileError(null)
    const lower = file.name.toLowerCase()
    if (lower.endsWith('.xlsx')) {
      try {
        // Loaded only when someone picks an Excel file (Housecall Pro and
        // QuickBooks export .xlsx), so the page itself stays light.
        const { readSheet } = await import('read-excel-file/browser')
        const sheet = await readSheet(file)
        loadTable(
          file.name,
          sheet.map((row) => row.map((c) => (c === null || c === undefined || c instanceof Date ? '' : String(c))))
        )
      } catch {
        setFileError('Could not read that Excel file. Try saving it as CSV and uploading again.')
      }
      return
    }
    if (lower.endsWith('.xls')) {
      setFileError('That is an old Excel format. Open it and save as .xlsx or .csv, then upload again.')
      return
    }
    if (!lower.endsWith('.csv') && file.type !== 'text/csv') {
      setFileError('Please choose a .csv or .xlsx file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => loadTable(file.name, parseCsv(String(reader.result ?? '')))
    reader.onerror = () => setFileError('Could not read that file.')
    reader.readAsText(file)
  }

  function reset() {
    setParsed(null)
    setMapping([])
    setFileError(null)
    setStep('upload')
  }

  const mappedRows = useMemo(() => {
    if (!parsed) return []
    return parsed.rows.map((row) => ({ ...buildCustomer(row, mapping), _raw: row }))
  }, [parsed, mapping])

  const readyRows = mappedRows.filter((r) => r.name)
  const skippedRows = mappedRows.filter((r) => !r.name)
  const hasNameMapped = hasNameSource(mapping)

  // Terminal success screen -- stays up regardless of `step` once the
  // action reports rows actually inserted.
  if (result && 'imported' in result) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
          ✓
        </div>
        <h2 className="text-lg font-semibold text-navy">
          Imported {result.imported} customer{result.imported === 1 ? '' : 's'}
        </h2>
        {result.skipped > 0 && (
          <p className="text-sm text-gray-400 mt-1.5">
            {result.skipped} row{result.skipped === 1 ? '' : 's'} skipped (no name mapped).
          </p>
        )}
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link
            href="/dashboard/customers"
            className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
          >
            View customers
          </Link>
          <button
            onClick={reset}
            className="text-sm font-semibold text-gray-500 hover:text-navy px-4 py-2 rounded-lg transition-colors"
          >
            Import another file
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full ${
                i === stepIndex
                  ? 'bg-navy text-white'
                  : i < stepIndex
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              <span>{i < stepIndex ? '✓' : i + 1}</span>
              {s.label}
            </div>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {step === 'upload' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleFile(file)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
              dragActive ? 'border-ice bg-ice/5' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
            <p className="text-sm font-medium text-navy">Drop your client export here, or click to browse</p>
            <p className="text-xs text-gray-400 mt-1.5">
              CSV or Excel (.xlsx), straight from Jobber, Housecall Pro, QuickBooks or any spreadsheet.
              We match the columns for you; you just check them.
            </p>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs text-gray-500">
            {EXPORT_HELP.map((h) => (
              <div key={h.app} className="rounded-xl bg-gray-50 p-4">
                <p className="font-semibold text-navy mb-1">From {h.app}</p>
                <p>{h.steps}</p>
              </div>
            ))}
          </div>
          {fileError && <p className="text-sm text-red-500 mt-4">{fileError}</p>}
        </div>
      )}

      {step === 'map' && parsed && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-navy">Map your columns</h2>
            <span className="text-xs text-gray-400">{parsed.fileName}</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">
            {parsed.rows.length} row{parsed.rows.length === 1 ? '' : 's'} detected. We guessed a mapping
            below — check it and adjust anything that&apos;s wrong.
          </p>

          <div className="space-y-3">
            {parsed.headers.map((header, i) => (
              <div key={i} className="flex items-center gap-4 border border-gray-100 rounded-xl p-3.5">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-navy truncate">{header}</div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">
                    {sampleValues(parsed.rows, i).join(' · ') || 'no sample values'}
                  </div>
                </div>
                <select
                  value={mapping[i]}
                  onChange={(e) => {
                    const next = [...mapping]
                    next[i] = e.target.value as ColumnTarget
                    setMapping(next)
                  }}
                  className="text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent bg-white shrink-0"
                >
                  <option value="skip">Don&apos;t import</option>
                  {COLUMN_TARGETS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {!hasNameMapped && (
            <p className="text-sm text-amber mt-4">Map a column to Full name, First name, Last name or Company to continue.</p>
          )}

          <div className="flex items-center justify-between mt-6">
            <button onClick={reset} className="text-sm text-gray-500 hover:text-navy transition-colors">
              ← Choose a different file
            </button>
            <button
              onClick={() => setStep('review')}
              disabled={!hasNameMapped}
              className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 'review' && parsed && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-navy mb-4">Review before importing</h2>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="rounded-xl bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-700">{readyRows.length}</div>
              <div className="text-xs text-green-700 mt-0.5">ready to import</div>
            </div>
            <div className={`rounded-xl p-4 ${skippedRows.length > 0 ? 'bg-amber/10' : 'bg-gray-50'}`}>
              <div className={`text-2xl font-bold ${skippedRows.length > 0 ? 'text-amber' : 'text-gray-400'}`}>
                {skippedRows.length}
              </div>
              <div className={`text-xs mt-0.5 ${skippedRows.length > 0 ? 'text-amber' : 'text-gray-400'}`}>
                skipped (no name)
              </div>
            </div>
          </div>

          {readyRows.length > 0 && (
            <div className="mb-5 border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-400">
                    <th className="text-left font-medium px-3.5 py-2">Name</th>
                    <th className="text-left font-medium px-3.5 py-2">Email</th>
                    <th className="text-left font-medium px-3.5 py-2">Phone</th>
                    <th className="text-left font-medium px-3.5 py-2">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {readyRows.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="px-3.5 py-2 text-navy">{r.name}</td>
                      <td className="px-3.5 py-2 text-gray-400">{r.email || '—'}</td>
                      <td className="px-3.5 py-2 text-gray-400">{r.phone || '—'}</td>
                      <td className="px-3.5 py-2 text-gray-400">{[r.address, r.city].filter(Boolean).join(', ') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {readyRows.length > 5 && (
                <div className="text-xs text-gray-400 px-3.5 py-2 bg-gray-50 border-t border-gray-100">
                  + {readyRows.length - 5} more
                </div>
              )}
            </div>
          )}

          {skippedRows.length > 0 && (
            <details className="mb-5">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-navy">
                Show skipped rows
              </summary>
              <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden text-xs">
                {skippedRows.slice(0, 5).map((r, i) => (
                  <div key={i} className="px-3.5 py-2 border-t border-gray-50 first:border-t-0 text-gray-400">
                    {r._raw.filter(Boolean).join(' · ') || '(empty row)'}
                  </div>
                ))}
                {skippedRows.length > 5 && (
                  <div className="px-3.5 py-2 border-t border-gray-50 text-gray-400">
                    + {skippedRows.length - 5} more
                  </div>
                )}
              </div>
            </details>
          )}

          {result && 'error' in result && (
            <p className="text-sm text-red-500 mb-4">{result.error}</p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              void runImport()
            }}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('map')}
                className="text-sm text-gray-500 hover:text-navy transition-colors"
              >
                ← Back to mapping
              </button>
              <button
                type="submit"
                disabled={pending || readyRows.length === 0}
                className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {pending
                  ? `Importing ${progress.toLocaleString()} of ${readyRows.length.toLocaleString()}…`
                  : `Import ${readyRows.length} customer${readyRows.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
