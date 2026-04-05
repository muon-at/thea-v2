'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function signup(email: string, password: string, displayName?: string) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Silently ignore cookie errors
          }
        },
      },
    }
  )

  try {
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
      console.error('Signup error:', error.message)
      return { error: error.message }
    }

    if (data?.user) {
      revalidatePath('/', 'layout')
      redirect('/onboarding')
    }

    return { error: 'Signup failed' }
  } catch (error: any) {
    console.error('Signup exception:', error.message)
    return { error: error.message || 'Signup failed' }
  }
}

export async function login(email: string, password: string) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Silently ignore cookie errors
          }
        },
      },
    }
  )

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      return { error: error.message }
    }

    if (data?.user) {
      revalidatePath('/', 'layout')
      redirect('/dashboard')
    }

    return { error: 'Login failed' }
  } catch (error: any) {
    console.error('Login exception:', error.message)
    return { error: error.message || 'Login failed' }
  }
}

export async function logout() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Silently ignore cookie errors
          }
        },
      },
    }
  )

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
