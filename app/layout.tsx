import type { Metadata } from 'next'
import { Inter, Bricolage_Grotesque, IBM_Plex_Mono } from 'next/font/google'
import { SchemaMarkup } from '@/components/schema-markup'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display-raw' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-raw',
})

export const metadata: Metadata = {
  title: 'HVAC Invoicing & Job Scheduling Software | Frostburn',
  description:
    'Frostburn helps small HVAC contractors automate invoicing, collect payments faster, and schedule jobs seamlessly. Free 30-day trial—no credit card required.',
  keywords:
    'HVAC software, HVAC invoicing software, job scheduling software, HVAC business management, payment collection software for contractors',
  openGraph: {
    title: 'HVAC Invoicing & Job Scheduling Software | Frostburn',
    description:
      'Get paid faster, schedule better, and stop chasing invoices. Built for HVAC contractors.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${plexMono.variable}`}>
      <head>
        <SchemaMarkup />
      </head>
      <body className="min-h-screen bg-white text-navy antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
