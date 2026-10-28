import type { Metadata } from 'next'
import { Inter, Bricolage_Grotesque, IBM_Plex_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display-raw' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-raw',
})
// The logo wordmark's face. Self-hosted by next/font so the logo no longer
// pulls a render-blocking stylesheet from fonts.googleapis.com.
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-logo' })

const SITE_TITLE = 'Frostburn — Run your HVAC company without hiring an office admin'
const SITE_DESCRIPTION =
  'Schedule jobs, manage maintenance agreements, and collect overdue invoices from one simple system built for 1–5 technician HVAC shops.'

export const metadata: Metadata = {
  metadataBase: new URL('https://frostburn.io'),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: 'Frostburn',
  openGraph: {
    type: 'website',
    siteName: 'Frostburn',
    url: 'https://frostburn.io',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${plexMono.variable} ${bebas.variable}`}>
      <body className="min-h-screen bg-white text-navy antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
