import { createClient } from '@supabase/supabase-js'

async function setAdminPassword() {
  const SUPABASE_URL = 'https://nxyncksyvcysbfurwxlh.supabase.co'
  const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eW5ja3N5dmN5c2JmdXJ3eGxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM1NDczNywiZXhwIjoyMDkwOTMwNzM3fQ.yeSm7zJpQvph_AT18hbxv_D3rFOwagS24vg-l5ymvlc'
  
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  try {
    // List all users to find admin
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const adminUser = users?.find(u => u.email === 'sebastiannordstokke@gmail.com')
    
    if (!adminUser) {
      throw new Error('Admin user not found')
    }

    console.log(`Found admin user: ${adminUser.id}`)

    // Set new password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        password: 'Thea2024!Admin',
      }
    )

    if (updateError) {
      throw updateError
    }

    console.log('✅ Password set successfully!')
    console.log(`\n🔐 Admin Credentials:`)
    console.log(`Email: sebastiannordstokke@gmail.com`)
    console.log(`Password: Thea2024!Admin`)
    console.log(`\n🔗 Test Login: https://thea-v2.vercel.app/login`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

setAdminPassword().then(() => {
  process.exit(0)
}).catch(error => {
  console.error('Failed:', error)
  process.exit(1)
})
