import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for auth session cookie
  const authSession = request.cookies.get('auth_session')?.value

  // Protected routes
  const protectedRoutes = [
    '/admin',
    '/dashboard',
    '/integrations',
    '/settings',
    '/analytics',
    '/onboarding',
  ]

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // If no session, redirect to login
    if (!authSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If logged in, don't allow access to login/signup
  if ((pathname === '/login' || pathname === '/signup') && authSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/integrations/:path*',
    '/settings/:path*',
    '/analytics/:path*',
    '/onboarding/:path*',
    '/login',
    '/signup',
  ],
}
