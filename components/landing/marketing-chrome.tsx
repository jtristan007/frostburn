import Link from 'next/link'
import { Logo } from '@/components/logo'

// Header and footer shared by the comparison and topic landing pages.

export function MarketingHeader() {
  return (
    <header className="border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" aria-label="Frostburn home">
          <Logo className="h-12" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-ice text-navy px-4 py-2 rounded-lg hover:bg-ice-dim transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}

export const MARKETING_LINKS = [
  { href: '/hvac-software-small-business', label: 'HVAC software for small business' },
  { href: '/hvac-invoicing-software', label: 'HVAC invoicing software' },
  { href: '/jobber-alternative', label: 'Jobber alternative' },
  { href: '/housecall-pro-alternative', label: 'Housecall Pro alternative' },
  { href: '/servicetitan-alternative', label: 'ServiceTitan alternative' },
  { href: '/fieldedge-alternative', label: 'FieldEdge alternative' },
]

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 py-8" style={{ background: '#05091a' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-3 text-sm text-mist">
        <Link href="/" aria-label="Frostburn home">
          <Logo className="h-9" />
        </Link>
        <p>
          Contact:{' '}
          <a href="mailto:info@frostburn.io" className="text-ice hover:underline">
            info@frostburn.io
          </a>
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          {MARKETING_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/security" className="hover:text-white">Security</Link>
        </div>
      </div>
    </footer>
  )
}
