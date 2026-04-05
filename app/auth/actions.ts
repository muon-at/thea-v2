'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export async function signup(email: string, password: string, displayName?: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || '',
      },
    },
  })

  if (error) {
    console.error('Signup error:', error)
    return { error: error.message || 'Signup failed' }
  }

  if (data?.user?.id) {
    revalidatePath('/', 'layout')
    redirect('/onboarding')
  }

  return { error: 'Signup failed: No user returned' }
}

export async function login(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    return { error: error.message || 'Login failed' }
  }

  if (data?.user?.id && data?.session) {
    // Session exists, redirect
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  return { error: 'Login failed: No user returned' }
}

export async function logout() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
