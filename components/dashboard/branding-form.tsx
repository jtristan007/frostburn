'use client'

import { useRef, useState, useTransition } from 'react'
import { updateLogo } from '@/app/actions/branding'

// A logo never needs to be bigger than this on an invoice.
const MAX_SIDE = 800
// Stay well under the server's request limit (next.config.ts).
const MAX_UPLOAD_BYTES = 2.5 * 1024 * 1024
const SVG_TYPE = 'image/svg+xml'

// An error whose message is written for the shop owner.
class LogoError extends Error {}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('unreadable'))
    }
    img.src = url
  })
}

// Phone photos and big exports are often several MB. Trim empty borders, then
// shrink any raster image to at most MAX_SIDE px on its longest side and re-save it as PNG (keeps
// transparency), or JPEG if the PNG is still too large. SVGs go as they are.
const SCAN_SIDE = 600

// Bounding box of pixels that aren't transparent or near-white. Returns the
// whole image when it's all blank (nothing sensible to trim to).
function contentBox(data: ImageData) {
  const { width, height } = data
  const px = data.data
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const blank = px[i + 3] < 16 || (px[i] > 244 && px[i + 1] > 244 && px[i + 2] > 244)
      if (!blank) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return { x: 0, y: 0, w: width, h: height }
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

async function prepareLogo(file: File): Promise<File> {
  if (file.type === SVG_TYPE) {
    if (file.size > MAX_UPLOAD_BYTES) throw new LogoError('That SVG is too large. Try one under 2.5MB.')
    return file
  }

  let img: HTMLImageElement
  try {
    img = await loadImage(file)
  } catch {
    throw new LogoError('This file can’t be read as an image. Save your logo as a PNG or JPEG and try again.')
  }

  // Find the logo inside any empty border (transparent or near-white), so a
  // small mark on a big blank square still shows up at header size. Scanned
  // on a copy of at most SCAN_SIDE px to keep it quick on phones.
  const scanScale = Math.min(1, SCAN_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
  const scan = document.createElement('canvas')
  scan.width = Math.max(1, Math.round(img.naturalWidth * scanScale))
  scan.height = Math.max(1, Math.round(img.naturalHeight * scanScale))
  const sctx = scan.getContext('2d', { willReadFrequently: true })
  if (!sctx) throw new LogoError('Your browser couldn’t resize this image. Try a smaller PNG or JPEG.')
  sctx.drawImage(img, 0, 0, scan.width, scan.height)
  const box = contentBox(sctx.getImageData(0, 0, scan.width, scan.height))
  const pad = Math.round(Math.max(box.w, box.h) * 0.04)
  const sx = Math.max(0, (box.x - pad) / scanScale)
  const sy = Math.max(0, (box.y - pad) / scanScale)
  const sw = Math.min(img.naturalWidth - sx, (box.w + pad * 2) / scanScale)
  const sh = Math.min(img.naturalHeight - sy, (box.h + pad * 2) / scanScale)
  const trimmed = sw < img.naturalWidth * 0.9 || sh < img.naturalHeight * 0.9

  const scale = Math.min(1, MAX_SIDE / Math.max(sw, sh))
  const smallEnough = file.size <= MAX_UPLOAD_BYTES && ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
  if (!trimmed && scale === 1 && smallEnough) return file

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round((trimmed ? sw : img.naturalWidth) * scale))
  canvas.height = Math.max(1, Math.round((trimmed ? sh : img.naturalHeight) * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new LogoError('Your browser couldn’t resize this image. Try a smaller PNG or JPEG.')
  if (trimmed) ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
  else ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  let blob = await canvasToBlob(canvas, 'image/png')
  let type = 'image/png'
  if (!blob || blob.size > MAX_UPLOAD_BYTES) {
    blob = await canvasToBlob(canvas, 'image/jpeg', 0.9)
    type = 'image/jpeg'
  }
  if (!blob || blob.size > MAX_UPLOAD_BYTES) throw new LogoError('That image is too large. Try a smaller PNG or JPEG.')

  const base = file.name.replace(/\.[^.]+$/, '') || 'logo'
  return new File([blob], `${base}.${type === 'image/png' ? 'png' : 'jpg'}`, { type })
}

export function BrandingForm({ currentLogoUrl }: { currentLogoUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setError(null)
    setSuccess(false)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setError('Choose a file first.')
      return
    }

    startTransition(async () => {
      try {
        const ready = await prepareLogo(file)
        const formData = new FormData()
        formData.append('logo', ready)
        const result = await updateLogo(formData)
        if (result.error) {
          setError(result.error)
        } else {
          setSuccess(true)
          setPreview(null)
          formRef.current?.reset()
        }
      } catch (err) {
        // Anything else (a dropped connection, a server limit) used to fail
        // silently, so always say something.
        setError(
          err instanceof LogoError
            ? err.message
            : 'The upload didn’t go through. Check your connection and try again with a PNG or JPEG.'
        )
      }
    })
  }

  const shown = preview ?? currentLogoUrl

  return (
    <form ref={formRef} onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
      <div className="flex items-center gap-5 mb-5">
        <div className="w-20 h-20 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="Company logo" className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-xs text-gray-400 text-center px-2">No logo yet</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-navy">Company logo</p>
          <p className="text-xs text-gray-400 mt-0.5">PNG or JPEG works everywhere, including emails. Large images are resized for you.</p>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        name="logo"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={onFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-ice-pale file:text-navy hover:file:bg-ice/20"
      />

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      {success && <p className="text-sm text-green-700 mt-3">Logo updated.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors disabled:opacity-50"
      >
        {isPending ? 'Uploading…' : 'Upload logo'}
      </button>
    </form>
  )
}
