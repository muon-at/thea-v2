import { NextRequest, NextResponse } from 'next/server'
import { generateEmailResponse } from '@/lib/claude/service'

export async function POST(request: NextRequest) {
  try {
    const { emailId, agentId, companyId, emailContent, agentContext } =
      await request.json()

    if (!emailId || !agentId || !companyId || !emailContent) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const result = await generateEmailResponse(
      emailId,
      agentId,
      companyId,
      emailContent,
      agentContext
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Response generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate response' },
      { status: 500 }
    )
  }
}
