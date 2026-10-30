'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthState =
  | { error: string; existingAccount?: boolean }
  | { message: string }
  | undefined

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const companyName = (formData.get('company_name') as string)?.trim()
  if (!companyName) return { error: 'Company name is required.' }

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding/plan`,
      data: { company_name: companyName },
    },
  })

  if (error) return { error: error.message }

  // With email confirmation on, Supabase answers a signup for an email that
  // already has an account with a "success" and a placeholder user that has
  // no identities -- and sends no email. Without this check the owner sees
  // "check your email" and waits for a message that never comes.
  if (data.user && data.user.identities?.length === 0) {
    return {
      error: 'An account with this email already exists. Log in instead, or reset your password if you’ve forgotten it.',
      existingAccount: true,
    }
  }

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
