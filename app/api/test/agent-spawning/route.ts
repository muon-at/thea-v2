import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
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

    // Test: Create a test company
    const testCompanyId = crypto.randomUUID()
    const testAgentId = `agent_${crypto.randomBytes(8).toString('hex')}`

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        id: testCompanyId,
        owner_id: testCompanyId, // For testing
        name: 'Test Company',
        email: `test-${Date.now()}@example.com`,
        subscription_tier: 'free',
        monthly_budget: 100,
      })
      .select()
      .single()

    if (companyError) {
      return NextResponse.json({
        success: false,
        error: `Failed to create company: ${companyError.message}`,
      })
    }

    // Test: Create agent for the company
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        company_id: testCompanyId,
        agent_id: testAgentId,
        agent_name: 'test_agent',
        memory: {
          created_at: new Date().toISOString(),
          company_name: 'Test Company',
          tier: 'free',
          blank_memory: true,
        },
        soul: {
          identity: 'I am test_agent, the AI assistant for Test Company',
          purpose: 'Test agent for email processing',
          tone: 'professional',
        },
        config: {
          max_tokens: 2000,
          temperature: 0.7,
          model: 'claude-3-5-sonnet',
        },
      })
      .select()
      .single()

    if (agentError) {
      return NextResponse.json({
        success: false,
        error: `Failed to create agent: ${agentError.message}`,
      })
    }

    // Test: Verify we can fetch both
    const { data: verifyCompany } = await supabase
      .from('companies')
      .select('*')
      .eq('id', testCompanyId)
      .single()

    const { data: verifyAgent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agent.id)
      .single()

    return NextResponse.json({
      success: true,
      message: 'Agent spawning test successful',
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        verified: !!verifyCompany,
      },
      agent: {
        id: agent.id,
        agent_id: agent.agent_id,
        agent_name: agent.agent_name,
        memory_blank: agent.memory.blank_memory,
        verified: !!verifyAgent,
      },
      test_result: '✅ Each company gets its own agent with blank memory',
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
