import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Frostburn — HVAC software that runs your business',
  description:
    'Invoicing, scheduling, maintenance agreements, and a pricing book built for small HVAC operators in Canada and the Pacific Northwest.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-navy antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
