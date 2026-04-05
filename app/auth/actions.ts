'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Server actions now call backend API endpoints
// This keeps Supabase SDK and JSON parsing on the server side only

export async function signup(email: string, password: string, displayName?: string) {
  try {
    const response = await fetch(`/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Signup failed' }
    }

    revalidatePath('/', 'layout')
    redirect('/onboarding')
  } catch (error: any) {
    console.error('Signup error:', error)
    return { error: error.message || 'Signup failed' }
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Login failed' }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)
    return { error: error.message || 'Login failed' }
  }
}

export async function logout() {
  try {
    await fetch(`/api/auth/logout`, {
      method: 'POST',
    })

    revalidatePath('/', 'layout')
    redirect('/login')
  } catch (error: any) {
    console.error('Logout error:', error)
    redirect('/login')
  }
}
