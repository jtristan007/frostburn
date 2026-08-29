'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { completeJobWithCapture, type CompletionPhoto } from '@/app/actions/jobs'
import { SignaturePad, type SignaturePadHandle } from '@/components/dashboard/signature-pad'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

// Uploads happen straight from the browser to Supabase Storage (the RLS
// write policy on job-media scopes by the caller's own account folder, same
// pattern as the logo uploader) -- this form only ever sends the resulting
// public URLs to the server action, never the files themselves.
export function JobCompletionForm({ jobId, accountId }: { jobId: string; accountId: string }) {
  const [beforeFiles, setBeforeFiles] = useState<File[]>([])
  const [afterFiles, setAfterFiles] = useState<File[]>([])
  const [signedBy, setSignedBy] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const signatureRef = useRef<SignaturePadHandle>(null)

  async function uploadPhoto(file: File, kind: 'before' | 'after'): Promise<CompletionPhoto> {
    const supabase = createClient()
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${accountId}/${jobId}/${kind}-${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('job-media').upload(path, file)
    if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`)
    const { data } = supabase.storage.from('job-media').getPublicUrl(path)
    return { url: data.publicUrl, kind }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const photos = await Promise.all([
        ...beforeFiles.map((f) => uploadPhoto(f, 'before')),
        ...afterFiles.map((f) => uploadPhoto(f, 'after')),
      ])

      let signatureUrl: string | null = null
      const signatureBlob = await signatureRef.current?.toBlob()
      if (signatureBlob) {
        const supabase = createClient()
        const path = `${accountId}/${jobId}/signature-${crypto.randomUUID()}.png`
        const { error: uploadError } = await supabase.storage.from('job-media').upload(path, signatureBlob, {
          contentType: 'image/png',
        })
        if (uploadError) throw new Error(`Signature upload failed: ${uploadError.message}`)
        signatureUrl = supabase.storage.from('job-media').getPublicUrl(path).data.publicUrl
      }

      await completeJobWithCapture(jobId, { signedBy: signedBy || null, signatureUrl, photos })
      // completeJobWithCapture redirects on success -- if we get here, it
      // was a genuine failure the try/catch below didn't already surface.
    } catch (e) {
      // completeJobWithCapture redirects on success, which Next.js
      // implements by throwing -- identified by `digest` starting with
      // NEXT_REDIRECT, not by the error's message. Must re-throw rather
      // than swallow, or the framework never gets to perform the actual
      // navigation and the job sits completed server-side with the user
      // stuck looking at a false failure message.
      if (typeof e === 'object' && e !== null && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith('NEXT_REDIRECT')) {
        throw e
      }
      setError(e instanceof Error ? e.message : 'Could not complete this job.')
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Before photos (optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setBeforeFiles(Array.from(e.target.files ?? []))}
            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-navy hover:file:bg-gray-200"
          />
          {beforeFiles.length > 0 && <p className="text-xs text-gray-400 mt-1">{beforeFiles.length} selected</p>}
        </div>
        <div>
          <label className={labelClass}>After photos (optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setAfterFiles(Array.from(e.target.files ?? []))}
            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-navy hover:file:bg-gray-200"
          />
          {afterFiles.length > 0 && <p className="text-xs text-gray-400 mt-1">{afterFiles.length} selected</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Customer signature (optional)</label>
        <SignaturePad ref={signatureRef} />
      </div>

      <div>
        <label className={labelClass} htmlFor="signed_by">
          Signed by
        </label>
        <input
          id="signed_by"
          value={signedBy}
          onChange={(e) => setSignedBy(e.target.value)}
          placeholder="Customer's name"
          className={inputClass}
        />
      </div>

      <button
        type="button"
        disabled={submitting}
        onClick={handleSubmit}
        className="w-full py-2.5 rounded-lg bg-ice text-navy text-sm font-semibold hover:bg-ice-dim transition-colors disabled:opacity-50"
      >
        {submitting ? 'Completing…' : 'Complete job'}
      </button>
    </div>
  )
}
