'use client'

import { useActionState, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { bulkImportCustomers, type ImportResult } from '@/app/actions/customers'
import { parseCsv } from '@/lib/csv/parse'
import { CUSTOMER_FIELDS, guessFieldForHeader, type ColumnTarget } from '@/lib/csv/customer-fields'

type Step = 'upload' | 'map' | 'review'

type ParsedFile = {
  fileName: string
  headers: string[]
  rows: string[][]
}

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

export function CustomerImportWizard() {
  const [step, setStep] = useState<Step>('upload')
  const [parsed, setParsed] = useState<ParsedFile | null>(null)
  const [mapping, setMapping] = useState<ColumnTarget[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [result, formAction, pending] = useActionState<ImportResult | undefined, FormData>(
    bulkImportCustomers,
    undefined
  )

  const stepIndex = STEPS.findIndex((s) => s.key === step)

  function handleFile(file: File) {
    setFileError(null)
    const looksLikeCsv = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv'
    if (!looksLikeCsv) {
      setFileError('Please choose a .csv file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? '')
      const table = parseCsv(text)
      if (table.length < 2) {
        setFileError('That file needs a header row plus at least one customer row.')
        return
      }
      const [headerRow, ...dataRows] = table
      const headers = headerRow.map((h) => h.trim() || '(blank)')
      setParsed({ fileName: file.name, headers, rows: dataRows })
      setMapping(headers.map(guessFieldForHeader))
      setStep('map')
    }
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
    const fieldIndex: Partial<Record<string, number>> = {}
    mapping.forEach((target, i) => {
      if (target !== 'skip') fieldIndex[target] = i
    })
    return parsed.rows.map((row) => ({
      name: fieldIndex.name !== undefined ? (row[fieldIndex.name] ?? '').trim() : '',
      email: fieldIndex.email !== undefined ? (row[fieldIndex.email] ?? '').trim() : '',
      phone: fieldIndex.phone !== undefined ? (row[fieldIndex.phone] ?? '').trim() : '',
      address: fieldIndex.address !== undefined ? (row[fieldIndex.address] ?? '').trim() : '',
      city: fieldIndex.city !== undefined ? (row[fieldIndex.city] ?? '').trim() : '',
      notes: fieldIndex.notes !== undefined ? (row[fieldIndex.notes] ?? '').trim() : '',
      _raw: row,
    }))
  }, [parsed, mapping])

  const readyRows = mappedRows.filter((r) => r.name)
  const skippedRows = mappedRows.filter((r) => !r.name)
  const hasNameMapped = mapping.includes('name')

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
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
            <p className="text-sm font-medium text-navy">Drop a CSV file here, or click to browse</p>
            <p className="text-xs text-gray-400 mt-1.5">
              Works with an export from Jobber, Housecall Pro, QuickBooks, or any spreadsheet —
              you&apos;ll map the columns yourself on the next step.
            </p>
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
            {parsed.headers.map((header, i) => {
              const usedElsewhere = new Set(
                mapping.filter((_, j) => j !== i && mapping[j] !== 'skip').map((m) => m)
              )
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 border border-gray-100 rounded-xl p-3.5"
                >
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
                    {CUSTOMER_FIELDS.filter((f) => !usedElsewhere.has(f.value) || f.value === mapping[i]).map(
                      (f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                          {f.required ? ' (required)' : ''}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )
            })}
          </div>

          {!hasNameMapped && (
            <p className="text-sm text-amber mt-4">Map one column to Name to continue.</p>
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
                    <th className="text-left font-medium px-3.5 py-2">City</th>
                  </tr>
                </thead>
                <tbody>
                  {readyRows.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="px-3.5 py-2 text-navy">{r.name}</td>
                      <td className="px-3.5 py-2 text-gray-400">{r.email || '—'}</td>
                      <td className="px-3.5 py-2 text-gray-400">{r.phone || '—'}</td>
                      <td className="px-3.5 py-2 text-gray-400">{r.city || '—'}</td>
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

          <form action={formAction}>
            <input type="hidden" name="rows_json" value={JSON.stringify(readyRows)} />
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
                {pending ? 'Importing…' : `Import ${readyRows.length} customer${readyRows.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
