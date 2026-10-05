import * as Sentry from '@sentry/nextjs'

// No-ops if NEXT_PUBLIC_SENTRY_DSN is unset -- safe to deploy before Sentry
// is wired up in the dashboard.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
