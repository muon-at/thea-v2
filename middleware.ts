import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes
  if (pathname.startsWith('/admin')) {
    const adminUser = request.cookies.get('admin_user')?.value
    const userId = request.cookies.get('auth_user_id')?.value

    // If accessing admin route without auth, redirect to login
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // In production, we'd verify admin status in the page component
    // For now, we just ensure user is authenticated
  }

  // Protect customer routes
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/integrations') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/onboarding')
  ) {
    const userId = request.cookies.get('auth_user_id')?.value
    
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
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
  ],
}
