import type { MetadataRoute } from 'next'
import { TEMPLATES } from '@/components/landing/template-page'

const SITE_URL = 'https://frostburn.io'

// lastModified = the date the page's content last changed. Update it when
// you edit a page so Google knows to re-crawl it.

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: '2026-11-01', changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/jobber-alternative`, lastModified: '2026-10-20', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/housecall-pro-alternative`, lastModified: '2026-10-20', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/servicetitan-alternative`, lastModified: '2026-10-20', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/fieldedge-alternative`, lastModified: '2026-10-21', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/hvac-software-small-business`, lastModified: '2026-10-21', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/hvac-invoicing-software`, lastModified: '2026-11-13', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/pricing`, lastModified: '2026-10-21', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/templates`, lastModified: '2026-11-13', changeFrequency: 'monthly', priority: 0.8 },
    ...TEMPLATES.map((t) => ({
      url: `${SITE_URL}/templates/${t.slug}`,
      lastModified: '2026-11-13',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/security`, lastModified: '2026-10-05', changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: '2026-10-05', changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: '2026-10-05', changeFrequency: 'yearly', priority: 0.2 },
  ]
}
