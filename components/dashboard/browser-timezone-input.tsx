'use client'

import { useEffect, useRef } from 'react'

// Hidden form field carrying the browser's IANA time zone, so the server
// can record the shop's zone the first time a job is scheduled. Filled in
// after mount (the server doesn't know the browser's zone).
export function BrowserTimeZoneInput() {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
  }, [])
  return <input ref={ref} type="hidden" name="browser_tz" defaultValue="" />
}
