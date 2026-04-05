'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function setupAdminUser(email: string) {
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

  try {
    // Check if user exists in auth
    const { data } = await supabase.auth.admin.listUsers()
    const users = data?.users || []
    
    let userId: string | null = null
    
    // Find user by email
    const existingUser = users.find(u => u.email === email)
    
    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create new user if doesn't exist
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: 'TempPassword123!', // Should be changed by user
        email_confirm: true,
      })

      if (createError) {
        throw new Error(`Failed to create admin user: ${createError.message}`)
      }

      userId = newUser?.user?.id
    }

    if (!userId) {
      throw new Error('Failed to get user ID')
    }

    // Create/update admin_users record
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .upsert({
        id: userId,
        is_super_admin: true,
        can_view_all_companies: true,
        can_manage_companies: true,
      }, {
        onConflict: 'id',
      })
      .select()
      .single()

    if (adminError) {
      throw new Error(`Failed to create admin record: ${adminError.message}`)
    }

    return {
      success: true,
      userId,
      email,
      message: `Admin user ${email} created/updated successfully`,
    }
  } catch (error) {
    console.error('Admin setup error:', error)
    throw error
  }
}

export async function verifyAdminUser(userId: string) {
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

  try {
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return { isAdmin: false }
    }

    return {
      isAdmin: adminUser?.is_super_admin || false,
      canViewAll: adminUser?.can_view_all_companies || false,
      canManage: adminUser?.can_manage_companies || false,
    }
  } catch (error) {
    console.error('Admin verification error:', error)
    return { isAdmin: false }
  }
}
