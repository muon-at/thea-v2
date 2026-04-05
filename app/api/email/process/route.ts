import { NextRequest, NextResponse } from 'next/server'
import { batchProcessEmails } from '@/lib/claude/service'

export async function POST(request: NextRequest) {
  try {
    const { companyId, agentId } = await request.json()

    if (!companyId || !agentId) {
      return NextResponse.json(
        { error: 'Missing companyId or agentId' },
        { status: 400 }
      )
    }

    const result = await batchProcessEmails(companyId, agentId)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Email processing error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process emails' },
      { status: 500 }
    )
  }
}
