import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // org/project/authToken are read from SENTRY_ORG / SENTRY_PROJECT /
  // SENTRY_AUTH_TOKEN env vars -- unset until Sentry is configured in
  // Vercel, in which case source map upload is skipped (with a build-time
  // warning) rather than failing the build.
  silent: true,
});
