'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logout } from '@/app/actions/auth'
import { Logo } from '@/components/logo'

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/pricing-book', label: 'Pricing Book' },
  { href: '/dashboard/quotes', label: 'Quotes' },
  { href: '/dashboard/customers', label: 'Customers' },
  { href: '/dashboard/agreements', label: 'Agreements' },
  { href: '/dashboard/jobs', label: 'Jobs' },
  { href: '/dashboard/invoices', label: 'Invoices' },
  { href: '/dashboard/assistant', label: 'AI Assistant' },
]

const SETTINGS_LINKS = [
  { href: '/dashboard/settings/team', label: 'Team' },
  { href: '/dashboard/settings/quickbooks', label: 'QuickBooks' },
  { href: '/dashboard/settings/branding', label: 'Branding' },
  { href: '/dashboard/settings/billing', label: 'Billing' },
]

export function DashboardNav({ accountName }: { accountName: string }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ background: '#05091a' }} className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="inline-block">
              <Logo className="h-10" />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {LINKS.map((link) => {
                const active =
                  link.href === '/dashboard' ? pathname === link.href : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-ice/15 border border-ice/30 text-ice text-xs font-semibold flex items-center justify-center">
                {accountName.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline max-w-[160px] truncate">{accountName}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-gray-500">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-navy-card border border-white/10 rounded-xl shadow-xl py-1.5 z-50">
                  {SETTINGS_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        pathname.startsWith(link.href) ? 'text-white bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="my-1.5 border-t border-white/10" />
                  <form action={logout}>
                    <button
                      type="submit"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
