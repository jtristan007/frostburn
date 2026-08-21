import { Resend } from 'resend'

// Server-only. Never import this from a client component.
export const resend = new Resend(process.env.RESEND_API_KEY!)

export const EMAIL_FROM = 'Frostburn <notifications@frostburn.io>'
