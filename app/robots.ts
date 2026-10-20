import type { MetadataRoute } from 'next'

const SITE_URL = 'https://frostburn.io'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // App screens and customer-specific token links (quotes, payment,
      // portal) have no business in search results.
      disallow: [
        '/dashboard',
        '/onboarding',
        '/api/',
        '/auth/',
        '/logout',
        '/reset-password',
        '/quote/',
        '/pay/',
        '/portal/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
