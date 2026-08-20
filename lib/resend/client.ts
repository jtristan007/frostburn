import { Resend } from 'resend'

// Server-only. Never import this from a client component.
export const resend = new Resend(process.env.RESEND_API_KEY!)

// resend.dev is Resend's shared test domain -- works with zero setup, but
// only delivers to the Resend account owner's own inbox. Switch to
// notifications@frostburn.io once that domain is verified with Resend
// (Domains -> Add Domain -> add the DNS records it gives you, same GoDaddy
// panel used for the Vercel DNS records).
export const EMAIL_FROM = 'Frostburn <onboarding@resend.dev>'
