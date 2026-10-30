import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAccountForNewUser } from '@/app/actions/account'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next') ?? '/dashboard'
  // Only same-site paths -- never an absolute, protocol-relative or
  // userinfo-style target like "@evil.com" (same rule as /auth/confirm).
  const next = /^\/(?![\/\\])/.test(nextParam) ? nextParam : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        try {
          await createAccountForNewUser(user)
        } catch (e) {
          console.error('createAccountForNewUser failed:', e)
          return NextResponse.redirect(
            `${origin}/login?error=Could not finish setting up your account`
          )
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not confirm your account`)
}
