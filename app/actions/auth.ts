'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthState =
  | { error: string }
  | { message: string }
  | undefined

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  // TEMP DIAGNOSTIC (2026-08-20): login is crashing in production with no
  // accessible logs. Wrap everything except redirect() (which must stay
  // outside try/catch per Next.js docs) to surface the real error to the
  // user instead of a generic 500. Remove once root-caused.
  let supabase
  try {
    supabase = await createClient()
  } catch (err) {
    return { error: `createClient failed: ${err instanceof Error ? err.message : String(err)}` }
  }

  let signInError
  try {
    const result = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    signInError = result.error
  } catch (err) {
    return {
      error: `signInWithPassword failed: ${err instanceof Error ? err.message : String(err)}`,
    }
  }

  if (signInError) return { error: signInError.message }

  redirect('/dashboard')
}

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const companyName = (formData.get('company_name') as string)?.trim()
  if (!companyName) return { error: 'Company name is required.' }

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding/plan`,
      data: { company_name: companyName },
    },
  })

  if (error) return { error: error.message }

  return { message: 'Check your email to confirm your account, then pick a plan to get started.' }
}

export async function forgotPassword(state: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get('email') as string,
    { redirectTo: `${siteUrl}/auth/callback?next=/reset-password` }
  )

  if (error) return { error: error.message }

  return { message: 'Check your email for a password reset link.' }
}

export async function resetPassword(state: AuthState, formData: FormData): Promise<AuthState> {
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (password !== confirm) return { error: 'Passwords do not match.' }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
