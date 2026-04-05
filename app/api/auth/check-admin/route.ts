import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // Get session
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ isAdmin: false })
    }

    // Check if user is in admin metadata or if email matches known admin
    const isAdminByEmail = user.email === 'sebastiannordstokke@gmail.com'
    const isAdminByMetadata = user.user_metadata?.is_super_admin === true

    return NextResponse.json({
      isAdmin: isAdminByEmail || isAdminByMetadata,
      email: user.email,
      userId: user.id,
    })
  } catch (error) {
    return NextResponse.json({ isAdmin: false, error: (error as Error).message })
  }
}
