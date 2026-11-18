import type { MetadataRoute } from 'next'

// Makes Frostburn installable from the browser ("Add to Home Screen" on
// iPhone, "Install app" on Android/Chrome): it then opens full screen from
// its own icon with no browser bar. start_url is the dashboard, so an
// installed app opens to the shop's day, not the marketing homepage
// (logged-out users are sent to /login by the proxy as usual).
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/dashboard',
    name: 'Frostburn',
    short_name: 'Frostburn',
    description: 'Scheduling, invoicing and payments for small HVAC shops.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#05091A',
    theme_color: '#05091A',
    categories: ['business', 'productivity'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
