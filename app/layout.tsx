import type { Metadata } from 'next'
import { Inter, Bricolage_Grotesque, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display-raw' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-raw',
})

export const metadata: Metadata = {
  title: 'Frostburn — HVAC software that runs your business',
  description:
    'Invoicing, scheduling, maintenance agreements, and a pricing book built for small HVAC operators.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-white text-navy antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
