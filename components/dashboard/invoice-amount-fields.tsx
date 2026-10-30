'use client'

import { useState } from 'react'
import { formatMoney, totalWithTax, type Country } from '@/lib/money'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

// Amount inputs for the invoice form. US shops enter a single total, same as
// before. Canadian shops enter the amount before tax plus a GST/HST rate,
// and see the total the customer will be charged; the server recomputes the
// total from the same two numbers, so this preview is display only.
export function InvoiceAmountFields({
  country,
  defaultTotal,
  defaultSubtotal,
  defaultTaxRate,
}: {
  country: Country
  defaultTotal?: number | string | null
  defaultSubtotal?: number | string | null
  defaultTaxRate: number
}) {
  const [subtotal, setSubtotal] = useState(
    defaultSubtotal != null ? String(defaultSubtotal) : defaultTotal != null ? String(defaultTotal) : ''
  )
  const [rate, setRate] = useState(String(defaultTaxRate))

  if (country !== 'CA') {
    return (
      <div>
        <label className={labelClass} htmlFor="total">Total ($)</label>
        <input
          id="total"
          name="total"
          type="number"
          step="0.01"
          min="0"
          defaultValue={defaultTotal ?? undefined}
          required
          className={inputClass}
        />
      </div>
    )
  }

  const sub = Number(subtotal)
  const r = Number(rate)
  const preview = Number.isFinite(sub) && Number.isFinite(r) && subtotal !== '' ? totalWithTax(sub, r) : null

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelClass} htmlFor="subtotal">Amount before tax ($)</label>
        <input
          id="subtotal"
          name="subtotal"
          type="number"
          step="0.01"
          min="0"
          value={subtotal}
          onChange={(e) => setSubtotal(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="tax_rate">GST/HST (%)</label>
        <input
          id="tax_rate"
          name="tax_rate"
          type="number"
          step="0.001"
          min="0"
          max="25"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <p className="col-span-2 text-xs text-gray-500">
        {preview != null ? (
          <>
            Customer pays <span className="font-semibold text-navy">{formatMoney(preview, 'CA')}</span>. Use 0% if
            you&apos;re not registered for GST.
          </>
        ) : (
          'Enter the amount before tax. 5% is GST in BC; use 13% or 15% for HST provinces, or 0% if you’re not registered.'
        )}
      </p>
    </div>
  )
}
