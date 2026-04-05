import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Server-side Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Signup happens server-side
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
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data?.user) {
      return NextResponse.json(
        { error: 'Signup failed' },
        { status: 400 }
      )
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      user: data.user,
      message: 'Check your email to confirm your account',
    })

    // Set session cookie if session exists
    if (data.session) {
      response.cookies.set('auth_session', JSON.stringify({
        userId: data.user.id,
        email: data.user.email,
        sessionToken: data.session.access_token,
        expiresAt: data.session.expires_at,
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return response
  } catch (error: any) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
