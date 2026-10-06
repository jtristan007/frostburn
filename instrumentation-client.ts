import * as Sentry from '@sentry/nextjs'

// No-ops if NEXT_PUBLIC_SENTRY_DSN is unset -- safe to deploy before Sentry
// is wired up in the dashboard. DSN is meant to be public (unlike an API
// key, it only identifies where to send events) -- see
// https://docs.sentry.io/concepts/key-terms/dsn-explainer/#dsn-utilization.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})
