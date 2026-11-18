'use client'

import { useEffect, useState } from 'react'

// Chrome/Edge/Samsung Internet fire this when the site can be installed; it
// isn't in TypeScript's DOM types.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'frostburn-install-banner-dismissed'

type Mode = 'hidden' | 'prompt' | 'ios' | 'android-manual'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari's own flag for a home-screen web app.
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

// A one-line prompt on phones to put Frostburn on the home screen, so techs
// open it like an app. Never shown on desktop, inside the installed app, or
// after it's been dismissed on that device.
export function InstallAppBanner() {
  const [mode, setMode] = useState<Mode>('hidden')
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isStandalone() || wasDismissed()) return
    const ua = navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/.test(ua)
    if (!isIOS && !isAndroid) return

    if (isIOS) {
      // iOS has no install prompt event; Share > Add to Home Screen is the
      // only route, so show how. (Deferred a tick: no setState in the effect body.)
      const t = window.setTimeout(() => setMode('ios'), 0)
      return () => window.clearTimeout(t)
    }

    // Android: use the browser's own install prompt if it offers one;
    // otherwise (Firefox, older browsers) explain the menu route.
    const fallback = window.setTimeout(() => setMode((m) => (m === 'hidden' ? 'android-manual' : m)), 2500)
    const onPrompt = (e: Event) => {
      e.preventDefault()
      window.clearTimeout(fallback)
      setDeferred(e as BeforeInstallPromptEvent)
      setMode('prompt')
    }
    const onInstalled = () => setMode('hidden')
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.clearTimeout(fallback)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Private mode or blocked storage: just hide it for this visit.
    }
    setMode('hidden')
  }

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    if (outcome === 'accepted') setMode('hidden')
  }

  if (mode === 'hidden') return null

  return (
    <div className="print:hidden bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="" className="w-10 h-10 rounded-lg flex-none" />
        <div className="flex-1 min-w-0 text-sm">
          <p className="font-semibold">Put Frostburn on your home screen</p>
          {mode === 'prompt' && <p className="text-gray-300 text-xs mt-0.5">Opens like an app, no browser bar.</p>}
          {mode === 'ios' && (
            <p className="text-gray-300 text-xs mt-0.5">
              Tap the Share button{' '}
              <svg viewBox="0 0 24 24" aria-label="Share" className="inline w-4 h-4 -mt-0.5 fill-none stroke-current" strokeWidth="2">
                <path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>{' '}
              then <span className="font-semibold text-white">Add to Home Screen</span>.
            </p>
          )}
          {mode === 'android-manual' && (
            <p className="text-gray-300 text-xs mt-0.5">
              Open your browser menu <span className="font-semibold text-white">⋮</span> and tap{' '}
              <span className="font-semibold text-white">Install app</span> or{' '}
              <span className="font-semibold text-white">Add to Home screen</span>.
            </p>
          )}
        </div>
        {mode === 'prompt' && (
          <button
            type="button"
            onClick={install}
            className="flex-none text-sm font-semibold bg-ice text-navy px-3 py-1.5 rounded-lg hover:bg-ice-dim"
          >
            Install
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="flex-none text-gray-400 hover:text-white text-xl leading-none px-1"
        >
          ×
        </button>
      </div>
    </div>
  )
}
