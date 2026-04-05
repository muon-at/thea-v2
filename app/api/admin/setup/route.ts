import { NextRequest, NextResponse } from 'next/server'
import { setupAdminUser } from '@/lib/admin/setup'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const result = await setupAdminUser(email)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Admin setup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to setup admin user' },
      { status: 500 }
    )
  }
}
