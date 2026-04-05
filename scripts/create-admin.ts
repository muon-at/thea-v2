import { createClient } from '@supabase/supabase-js'

async function createAdminUser() {
  const SUPABASE_URL = 'https://nxyncksyvcysbfurwxlh.supabase.co'
  const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eW5ja3N5dmN5c2JmdXJ3eGxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NDczNywiZXhwIjoyMDkwOTMwNzM3fQ.yeSm7zJpQvph_AT18hbxv_D3rFOwagS24vg-l5ymvlc'
  
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  try {
    console.log('Creating admin user...')
    
    // Create user with email and password
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email: 'sebastiannordstokke@gmail.com',
      password: 'AdminPassword123!',
      email_confirm: true,
    })

    if (createError) {
      if (createError.message.includes('already exists')) {
        console.log('User already exists, getting user ID...')
        // Get the user ID
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
        const existingUser = users?.find(u => u.email === 'sebastiannordstokke@gmail.com')
        if (existingUser) {
          console.log(`Found existing user: ${existingUser.id}`)
          return existingUser.id
        }
      } else {
        throw createError
      }
    } else {
      console.log(`✅ User created: ${user?.id}`)
      return user?.id
    }
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

createAdminUser().then(userId => {
  console.log('\n✅ Admin user ready!')
  console.log(`Email: sebastiannordstokke@gmail.com`)
  console.log(`Password: AdminPassword123!`)
  console.log(`\nLogin at: https://thea-v2.vercel.app/login`)
  console.log(`Admin dashboard: https://thea-v2.vercel.app/admin`)
}).catch(error => {
  console.error('Failed:', error)
  process.exit(1)
})
