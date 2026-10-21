import type { MetadataRoute } from 'next'

const SITE_URL = 'https://frostburn.io'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/jobber-alternative`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/housecall-pro-alternative`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/servicetitan-alternative`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/fieldedge-alternative`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/hvac-software-small-business`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/hvac-invoicing-software`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/pricing`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/signup`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/security`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
