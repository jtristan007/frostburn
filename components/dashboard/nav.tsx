'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
]

export function DashboardNav({ accountName }: { accountName: string }) {
  const pathname = usePathname()

  return (
    <header style={{ background: '#05091a' }} className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="inline-block">
              <Logo className="h-8" />
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline">{accountName}</span>
            <Link
              href="/dashboard/settings/billing"
              className="text-sm text-gray-400 hover:text-white"
            >
              Billing
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm text-gray-400 hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
