'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Error that Next.js throws on redirect - don't catch it
class NextRedirectError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NEXT_REDIRECT'
  }
}

// Helper to safely get cookie headers
function getSafeHeaders(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  try {
    return cookieStore.getAll()
  } catch (error) {
    console.error('Failed to get cookies:', error)
    return []
  }
}

export async function signup(email: string, password: string, displayName?: string) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return getSafeHeaders(cookieStore)
        },
        setAll(cookiesToSet) {
          try {
            if (!Array.isArray(cookiesToSet)) return
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set(name, value, options)
              } catch (e) {
                console.error(`Failed to set cookie ${name}:`, e)
              }
            })
          } catch (e) {
            console.error('Cookie error:', e)
          }
        },
      },
    }
  )

  // Sign up user
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
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return getSafeHeaders(cookieStore)
        },
        setAll(cookiesToSet) {
          try {
            if (!Array.isArray(cookiesToSet)) return
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set(name, value, options)
              } catch (e) {
                console.error(`Failed to set cookie ${name}:`, e)
              }
            })
          } catch (e) {
            console.error('Cookie error:', e)
          }
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    return { error: error.message || 'Login failed' }
  }

  if (data?.user?.id) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  return { error: 'Login failed: No user returned' }
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
          } catch {
            // Ignore errors
          }
        },
      },
    }
  )

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
