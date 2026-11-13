'use client'

import { useState } from 'react'

// Client-side controls for the free template pages. Kept tiny so the pages
// themselves stay server components.

export function PrintButton({ label = 'Save as PDF / Print' }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="font-semibold bg-ice text-navy px-5 py-3 rounded-lg hover:bg-ice-dim transition-colors print:hidden"
    >
      {label}
    </button>
  )
}

export function CopyButton({ targetId, label = 'Copy text' }: { targetId: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    const el = document.getElementById(targetId)
    if (!el) return
    try {
      await navigator.clipboard.writeText(el.innerText.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (older browsers, some in-app webviews);
      // fall back to selecting the text so the user can copy it by hand.
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="text-sm font-semibold bg-white/10 text-white border border-white/15 px-4 py-2 rounded-lg hover:bg-white/15 transition-colors"
    >
      {copied ? 'Copied ✓' : label}
    </button>
  )
}
