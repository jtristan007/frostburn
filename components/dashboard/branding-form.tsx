'use client'

import { useRef, useState, useTransition } from 'react'
import { updateLogo } from '@/app/actions/branding'

export function BrandingForm({ currentLogoUrl }: { currentLogoUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setError(null)
    setSuccess(false)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  function onSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await updateLogo(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setPreview(null)
        formRef.current?.reset()
      }
    })
  }

  const shown = preview ?? currentLogoUrl

  return (
    <form ref={formRef} action={onSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
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
          <p className="text-xs text-gray-400 mt-0.5">PNG, JPEG, WebP, or SVG. Up to 2MB.</p>
        </div>
      </div>

      <input
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
