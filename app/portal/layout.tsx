import type { Metadata } from 'next'

// Private screen / customer-specific link: keep out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
