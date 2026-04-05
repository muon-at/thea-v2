import { NextRequest, NextResponse } from 'next/server'
import { handleOAuthCallback } from '@/lib/oauth/actions'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const provider = searchParams.get('provider') as 'gmail' | 'outlook'

  if (!code || !state || !provider) {
    return NextResponse.json(
      { error: 'Missing OAuth parameters' },
      { status: 400 }
    )
  }

  try {
    const result = await handleOAuthCallback(provider, code, state)
    
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'OAuth failed' },
      { status: 500 }
    )
  }
}
