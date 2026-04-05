import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function setupAdminUser() {
  const email = 'sebastianordstokke@gmail.com'
  // Generate a secure temporary password
  const tempPassword = crypto.randomBytes(16).toString('hex')

  console.log('🔐 Setting up superadmin user...')
  console.log(`Email: ${email}`)

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      console.log('✓ User already exists, updating password...')
      userId = existingUser.id

      // Update password
      await supabase.auth.admin.updateUserById(userId, {
        password: tempPassword,
      })
    } else {
      console.log('✓ Creating new user...')
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
      })

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`)
      }

      userId = newUser.user!.id
      console.log(`✓ User created with ID: ${userId}`)
    }

    // Create admin_users table if it doesn't exist
    const { error: tableError } = await supabase.rpc('create_admin_users_table')
    if (tableError && !tableError.message.includes('already exists')) {
      console.log('⚠️  Note: admin_users table may already exist')
    }

    // Create or update admin_users record
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .upsert(
        {
          id: userId,
          is_super_admin: true,
          can_view_all_companies: true,
          can_manage_companies: true,
        },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (adminError) {
      throw new Error(`Failed to create admin record: ${adminError.message}`)
    }

    console.log('✓ Admin user setup complete!')
    console.log('\n' + '='.repeat(50))
    console.log('🎉 SUPERADMIN ACCOUNT CREATED')
    console.log('='.repeat(50))
    console.log(`Email: ${email}`)
    console.log(`Password: ${tempPassword}`)
    console.log(`User ID: ${userId}`)
    console.log('\nLogin at: https://thea-v2.vercel.app/login')
    console.log('Dashboard: https://thea-v2.vercel.app/admin')
    console.log('='.repeat(50))

    return {
      email,
      password: tempPassword,
      userId,
    }
  } catch (error) {
    console.error('❌ Error setting up admin user:', error)
    throw error
  }
}

setupAdminUser()
  .then(result => {
    console.log('\n✅ Setup successful!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  })
