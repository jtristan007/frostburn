import Link from 'next/link'
import { Logo } from '@/components/logo'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative"
      style={{ background: '#05070f' }}
    >
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(5,7,15,0.82), rgba(5,7,15,0.95)), url(/frost-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
        }}
      />

      <div className="w-full max-w-sm relative">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Logo className="h-9 mx-auto" />
          </Link>
          <h1 className="mt-6 text-2xl font-display font-bold text-white">{title}</h1>
          <p className="mt-2 text-sm text-mist">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-2xl p-8">
          {children}
        </div>

        {footer && <p className="mt-6 text-center text-sm text-mist">{footer}</p>}
      </div>
    </div>
  )
}

export const authInputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-white/5 text-sm text-white placeholder-mist focus:outline-none focus:ring-2 focus:ring-ice focus:border-transparent transition'

export const authLabelClass = 'block text-sm font-medium text-gray-200 mb-1.5'
