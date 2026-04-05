'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateEmailResponse(
  emailId: string,
  agentId: string,
  companyId: string,
  emailContent: {
    from: string
    subject: string
    body: string
  },
  agentContext?: {
    memory?: any
    soul?: any
    config?: any
  }
) {
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
    // Build system prompt with agent context
    const systemPrompt = `You are ${agentContext?.soul?.identity || 'an AI email assistant'}.

${agentContext?.soul?.purpose ? `Your purpose: ${agentContext.soul.purpose}` : ''}

${agentContext?.memory?.company_name ? `You work for: ${agentContext.memory.company_name}` : ''}

${agentContext?.soul?.tone ? `Tone: ${agentContext.soul.tone}` : 'Tone: Professional'}

Instructions:
- Write concise, professional email responses
- Match the tone and style of incoming emails
- Be helpful and clear
- Keep responses brief (2-3 paragraphs max)
${agentContext?.memory?.signature ? `\nSignature to add:\n${agentContext.memory.signature}` : ''}

Generate a response to the following email:`

    // Call Claude API
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `From: ${emailContent.from}
Subject: ${emailContent.subject}

${emailContent.body}

Please write a professional response to this email.`,
        },
      ],
    })

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    // Track cost
    const inputTokens = message.usage.input_tokens
    const outputTokens = message.usage.output_tokens
    const costPerMtok = 0.003 // $3 per 1M tokens for Sonnet input, $15 for output (avg ~0.003)
    const estimatedCost = (inputTokens + outputTokens) * (costPerMtok / 1000000)

    // Store suggestion in database
    const { data: suggestion, error: dbError } = await supabase
      .from('response_suggestions')
      .insert({
        email_id: emailId,
        suggested_response: responseText,
        tone: agentContext?.soul?.tone || 'professional',
        tokens_used: inputTokens + outputTokens,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Failed to store suggestion:', dbError)
    }

    // Track cost
    await supabase.from('cost_tracking').insert({
      agent_id: agentId,
      company_id: companyId,
      service: 'claude',
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_cost: estimatedCost,
      cost_per_mtok: costPerMtok,
    })

    return {
      success: true,
      response: responseText,
      tokens: inputTokens + outputTokens,
      cost: estimatedCost.toFixed(4),
      suggestion,
    }
  } catch (error) {
    console.error('Claude API error:', error)
    throw error
  }
}

export async function trainAgentOnEmails(agentId: string, companyId: string) {
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
    // Get recent emails for training
    const { data: emails } = await supabase
      .from('emails')
      .select('*')
      .in(
        'email_account_id',
        (
          await supabase
            .from('email_accounts')
            .select('id')
            .eq('user_id', companyId)
        ).data?.map((a) => a.id) || []
      )
      .order('received_at', { ascending: false })
      .limit(10)

    if (!emails || emails.length === 0) {
      return { success: true, trained: 0 }
    }

    // Analyze email patterns
    const emailPatterns = {
      common_topics: [] as string[],
      writing_style: '',
      response_length: 'medium',
      formality: 'professional',
    }

    // Simple analysis (in production, this would be more sophisticated)
    const allSubjects = emails.map((e) => e.subject).join(' ')
    const commonWords = allSubjects
      .toLowerCase()
      .split(' ')
      .filter((w) => w.length > 5)
      .slice(0, 5)

    emailPatterns.common_topics = commonWords

    // Update agent memory with learned patterns
    const { data: agent } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (agent) {
      const updatedMemory = {
        ...agent.memory,
        trained_emails: emails.length,
        email_patterns: emailPatterns,
        last_training: new Date().toISOString(),
      }

      await supabase
        .from('agents')
        .update({ memory: updatedMemory })
        .eq('id', agentId)
    }

    return {
      success: true,
      trained: emails.length,
      patterns: emailPatterns,
    }
  } catch (error) {
    console.error('Training error:', error)
    throw error
  }
}

export async function batchProcessEmails(companyId: string, agentId: string) {
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
    // Get unprocessed emails
    const { data: emails } = await supabase
      .from('emails')
      .select('*')
      .eq('email_account_id', companyId)
      .is('is_draft', false)

    let processed = 0
    let totalCost = 0

    for (const email of emails || []) {
      try {
        const result = await generateEmailResponse(
          email.id,
          agentId,
          companyId,
          {
            from: email.from_address,
            subject: email.subject || '',
            body: email.body_text || '',
          }
        )

        processed++
        totalCost += parseFloat(result.cost)
      } catch (error) {
        console.error(`Failed to process email ${email.id}:`, error)
        // Continue processing other emails
      }
    }

    return {
      success: true,
      processed,
      totalCost: totalCost.toFixed(4),
    }
  } catch (error) {
    console.error('Batch processing error:', error)
    throw error
  }
}
