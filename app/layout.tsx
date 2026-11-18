import type { Metadata, Viewport } from 'next'
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
  // Installed on an iPhone home screen: open full screen, labelled
  // "Frostburn". The icon itself is app/apple-icon.png.
  appleWebApp: { capable: true, title: 'Frostburn', statusBarStyle: 'default' },
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

export const viewport: Viewport = {
  themeColor: '#05091A',
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
