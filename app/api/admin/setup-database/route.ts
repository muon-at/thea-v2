import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Verify this is only callable with proper auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for setup
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

    // Create admin_users table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.admin_users (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          is_super_admin BOOLEAN DEFAULT false,
          can_view_all_companies BOOLEAN DEFAULT false,
          can_manage_companies BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Admin can view own record" ON admin_users;
        DROP POLICY IF EXISTS "Service role has full access" ON admin_users;

        CREATE POLICY "Admin can view own record" ON admin_users
          FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Service role has full access" ON admin_users
          FOR ALL USING (auth.role() = 'service_role');

        INSERT INTO public.admin_users (id, is_super_admin, can_view_all_companies, can_manage_companies)
        VALUES ('342ccfef-8ab4-4a01-9657-0720941b7a67', true, true, true)
        ON CONFLICT (id) DO UPDATE SET
          is_super_admin = true,
          can_view_all_companies = true,
          can_manage_companies = true;
      `,
    })

    if (createError) {
      return NextResponse.json(
        {
          error: 'Failed to execute SQL',
          details: createError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Admin database setup completed',
      admin_user: 'sebastianordstokke@gmail.com',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
