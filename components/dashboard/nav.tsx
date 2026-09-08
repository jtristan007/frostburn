'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logout } from '@/app/actions/auth'
import { Logo } from '@/components/logo'

type NavLink = { href: string; label: string }
// A flat link, or a dropdown grouping a few related pages under one label.
// Was a single flat list of 8 links -- crowded and wrapped at normal
// widths once Dispatch was added. Grouped by actual workflow instead:
// Jobs' two views (list + dispatch board) are the same data looked at two
// ways, and Quotes/Invoices/Pricing Book are all the money-paperwork side
// of the business.
type NavEntry = NavLink | { label: string; items: NavLink[] }

const NAV: NavEntry[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/customers', label: 'Customers' },
  { href: '/dashboard/agreements', label: 'Agreements' },
  {
    label: 'Jobs',
    items: [
      { href: '/dashboard/jobs', label: 'All Jobs' },
      { href: '/dashboard/dispatch', label: 'Dispatch Board' },
    ],
  },
  {
    label: 'Billing',
    items: [
      { href: '/dashboard/quotes', label: 'Quotes' },
      { href: '/dashboard/invoices', label: 'Invoices' },
      { href: '/dashboard/pricing-book', label: 'Pricing Book' },
    ],
  },
  { href: '/dashboard/assistant', label: 'AI Assistant' },
]

const SETTINGS_LINKS = [
  { href: '/dashboard/settings/team', label: 'Team' },
  { href: '/dashboard/settings/quickbooks', label: 'QuickBooks' },
  { href: '/dashboard/settings/payments', label: 'Payments' },
  { href: '/dashboard/settings/branding', label: 'Branding' },
  { href: '/dashboard/settings/billing', label: 'Billing' },
]

const CHEVRON = (
  <svg width="8" height="5" viewBox="0 0 10 6" fill="none" className="text-gray-500">
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export function DashboardNav({ accountName }: { accountName: string }) {
  const pathname = usePathname()
  // One name for whichever menu is open -- 'account', a group label like
  // 'Jobs', or null. Opening one closes any other, same as a normal menu
  // bar.
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  function isActive(href: string) {
    return href === '/dashboard' ? pathname === href : pathname.startsWith(href)
  }

  return (
    <header style={{ background: '#05091a' }} className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="inline-block">
              <Logo className="h-10" />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((entry) => {
                if ('items' in entry) {
                  const active = entry.items.some((i) => isActive(i.href))
                  const open = openMenu === entry.label
                  return (
                    <div key={entry.label} className="relative">
                      <button
                        onClick={() => setOpenMenu(open ? null : entry.label)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          active || open ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {entry.label}
                        {CHEVRON}
                      </button>
                      {open && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                          <div className="absolute left-0 top-full mt-2 w-44 bg-navy-card border border-white/10 rounded-xl shadow-xl py-1.5 z-50">
                            {entry.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpenMenu(null)}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                  isActive(item.href)
                                    ? 'text-white bg-white/5'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(entry.href) ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {entry.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === 'account' ? null : 'account')}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-ice/15 border border-ice/30 text-ice text-xs font-semibold flex items-center justify-center">
                {accountName.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline max-w-[160px] truncate">{accountName}</span>
              {CHEVRON}
            </button>

            {openMenu === 'account' && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-navy-card border border-white/10 rounded-xl shadow-xl py-1.5 z-50">
                  {SETTINGS_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpenMenu(null)}
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
