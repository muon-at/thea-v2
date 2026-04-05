'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { OAUTH_CONFIG, OAuthProvider } from './config'
import crypto from 'crypto'

export async function initiateOAuthFlow(provider: OAuthProvider) {
  const cookieStore = await cookies()
  const config = OAUTH_CONFIG[provider]

  // Generate PKCE code challenge
  const codeVerifier = crypto.randomBytes(32).toString('hex')
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  // Generate state for CSRF protection
  const state = crypto.randomBytes(32).toString('hex')

  // Store in session/cookie for verification later
  cookieStore.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  })

  cookieStore.set(`oauth_verifier_${provider}`, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
  })

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
    ...(provider === 'gmail' && {
      access_type: 'offline',
      prompt: 'consent',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    }),
  })

  const authorizationUrl = `${config.authorizationUrl}?${params.toString()}`
  redirect(authorizationUrl)
}

export async function handleOAuthCallback(
  provider: OAuthProvider,
  code: string,
  state: string
) {
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
            // Ignore
          }
        },
      },
    }
  )

  // Verify state
  const storedState = cookieStore.get(`oauth_state_${provider}`)?.value
  if (!storedState || storedState !== state) {
    throw new Error('Invalid OAuth state')
  }

  const config = OAUTH_CONFIG[provider]
  const codeVerifier = cookieStore.get(`oauth_verifier_${provider}`)?.value

  // Exchange code for tokens
  const tokenResponse = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
      ...(codeVerifier && { code_verifier: codeVerifier }),
    }).toString(),
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange OAuth code for tokens')
  }

  const tokens = await tokenResponse.json()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Get user's email from provider
  let userEmail: string

  if (provider === 'gmail') {
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })
    const userInfo = await userInfoResponse.json()
    userEmail = userInfo.email
  } else {
    // Outlook
    const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })
    const userInfo = await userInfoResponse.json()
    userEmail = userInfo.mail || userInfo.userPrincipalName
  }

  // Store OAuth tokens in database
  const tokenExpiry = new Date()
  tokenExpiry.setSeconds(tokenExpiry.getSeconds() + tokens.expires_in)

  const { error: dbError } = await supabase
    .from('email_accounts')
    .upsert({
      user_id: user.id,
      email: userEmail,
      provider,
      access_token: tokens.access_token, // In production, encrypt this
      refresh_token: tokens.refresh_token || '',
      token_expires_at: tokenExpiry.toISOString(),
      sync_enabled: true,
    }, {
      onConflict: 'user_id,email,provider',
    })

  if (dbError) {
    throw new Error(`Failed to store OAuth tokens: ${dbError.message}`)
  }

  // Clean up cookies
  cookieStore.delete(`oauth_state_${provider}`)
  cookieStore.delete(`oauth_verifier_${provider}`)

  return {
    success: true,
    provider,
    email: userEmail,
  }
}
