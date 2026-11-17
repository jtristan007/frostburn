import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB request body, which silently broke
      // logo uploads between 1MB and the 2MB the page promised. The branding
      // form now shrinks images in the browser first; this is headroom for
      // SVGs and multipart overhead.
      bodySizeLimit: '4mb',
    },
  },
};

export default withSentryConfig(nextConfig, {
  // org/project/authToken are read from SENTRY_ORG / SENTRY_PROJECT /
  // SENTRY_AUTH_TOKEN env vars -- unset until Sentry is configured in
  // Vercel, in which case source map upload is skipped (with a build-time
  // warning) rather than failing the build.
  silent: true,
});
