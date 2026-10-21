import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { createAccountForNewUser } from '@/app/actions/account'

// Email-link landing for signup confirmation and password reset, using the
// token_hash flow. Unlike /auth/callback's PKCE code exchange, this doesn't
// need a cookie from the browser that requested the email, so the link
// works when opened on a phone or in a different browser. The Supabase
// email templates must link here:
//   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password
//   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/onboarding/plan
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const nextParam = searchParams.get('next') ?? '/dashboard'
  // Only same-site paths -- never an absolute or protocol-relative URL.
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard'

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        try {
          // Idempotent; creates the company on first confirmation only.
          await createAccountForNewUser(user)
        } catch (e) {
          console.error('createAccountForNewUser failed:', e)
          return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Could not finish setting up your account.')}`)
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('verifyOtp failed:', error.message)
  }

  const message =
    type === 'recovery'
      ? 'That reset link is invalid or has expired. Request a new one below.'
      : 'That link is invalid or has expired. Try signing in, or request a new link.'
  const dest = type === 'recovery' ? '/forgot-password' : '/login'
  return NextResponse.redirect(`${origin}${dest}?error=${encodeURIComponent(message)}`)
}
