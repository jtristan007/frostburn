'use client'

import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

export type SignaturePadHandle = {
  /** Null when nothing has been drawn. */
  toBlob: () => Promise<Blob | null>
  clear: () => void
  isEmpty: () => boolean
}

// Plain canvas + Pointer Events -- no drawing library. Pointer Events
// already unify mouse/touch/stylus, which is all a canvas signature pad
// needs; pulling in a dependency for this would be over-engineering it.
export const SignaturePad = forwardRef<SignaturePadHandle>(function SignaturePad(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const hasInkRef = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  useImperativeHandle(ref, () => ({
    toBlob: () =>
      new Promise((resolve) => {
        const canvas = canvasRef.current
        if (!canvas || !hasInkRef.current) return resolve(null)
        canvas.toBlob((blob) => resolve(blob), 'image/png')
      }),
    clear: () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      hasInkRef.current = false
      setHasInk(false)
    },
    isEmpty: () => !hasInkRef.current,
  }))

  function pointFromEvent(canvas: HTMLCanvasElement, e: React.PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    // Canvas backing-store size is set larger than its CSS size below (for
    // sharper strokes on high-DPI screens), so pointer coordinates need the
    // same scale factor applied.
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    canvas.setPointerCapture(e.pointerId)
    drawingRef.current = true
    const { x, y } = pointFromEvent(canvas, e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const { x, y } = pointFromEvent(canvas, e)
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0a1628'
    ctx.lineTo(x, y)
    ctx.stroke()
    if (!hasInkRef.current) {
      hasInkRef.current = true
      setHasInk(true)
    }
  }

  function handlePointerUp() {
    drawingRef.current = false
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-[160px] rounded-lg border border-gray-200 bg-white touch-none cursor-crosshair"
      />
      {hasInk && (
        <button
          type="button"
          onClick={() => {
            const canvas = canvasRef.current
            const ctx = canvas?.getContext('2d')
            if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
            hasInkRef.current = false
            setHasInk(false)
          }}
          className="mt-2 text-xs text-gray-400 hover:text-gray-600"
        >
          Clear signature
        </button>
      )}
    </div>
  )
})
