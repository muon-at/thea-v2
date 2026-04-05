'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function createCompany(
  name: string,
  email: string,
  subscriptionTier: 'free' | 'pro' | 'enterprise' = 'free'
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

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Create company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({
      owner_id: user.id,
      name,
      email,
      subscription_tier: subscriptionTier,
      monthly_budget: subscriptionTier === 'enterprise' ? 1000 : subscriptionTier === 'pro' ? 500 : 100,
    })
    .select()
    .single()

  if (companyError) {
    throw new Error(`Failed to create company: ${companyError.message}`)
  }

  // Create agent for company
  const agentId = `agent_${crypto.randomBytes(8).toString('hex')}`
  const agentName = name.replace(/\s+/g, '_').toLowerCase()

  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .insert({
      company_id: company.id,
      agent_id: agentId,
      agent_name: agentName,
      memory: {
        created_at: new Date().toISOString(),
        company_name: name,
        company_email: email,
        tier: subscriptionTier,
      },
      soul: {
        identity: `I am ${agentName}, the AI assistant for ${name}`,
        purpose: 'Manage emails and automate communication',
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
    throw new Error(`Failed to create agent: ${agentError.message}`)
  }

  return {
    company,
    agent,
  }
}

export async function getCompanies() {
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('companies')
    .select('*, agents(*), daily_cost_summary(*)')

  if (!adminUser?.can_view_all_companies) {
    query = query.eq('owner_id', user.id)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch companies: ${error.message}`)
  }

  return data
}

export async function getCompanyStats(companyId: string) {
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

  // Get company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single()

  if (!company) {
    throw new Error('Company not found')
  }

  // Get today's costs
  const today = new Date().toISOString().split('T')[0]
  const { data: todaysCost } = await supabase
    .from('daily_cost_summary')
    .select('*')
    .eq('company_id', companyId)
    .eq('date', today)
    .single()

  // Get this month's total
  const monthStart = new Date()
  monthStart.setDate(1)
  const monthStartStr = monthStart.toISOString().split('T')[0]

  const { data: monthCosts } = await supabase
    .from('daily_cost_summary')
    .select('total_cost')
    .eq('company_id', companyId)
    .gte('date', monthStartStr)

  const monthlyTotal = monthCosts?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0

  // Get last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysStr = thirtyDaysAgo.toISOString().split('T')[0]

  const { data: last30Days } = await supabase
    .from('daily_cost_summary')
    .select('*')
    .eq('company_id', companyId)
    .gte('date', thirtyDaysStr)
    .order('date', { ascending: false })

  return {
    company,
    today: {
      claude: todaysCost?.claude_cost || 0,
      emailSync: todaysCost?.email_sync_cost || 0,
      storage: todaysCost?.storage_cost || 0,
      total: todaysCost?.total_cost || 0,
    },
    month: {
      total: monthlyTotal,
      budget: company.monthly_budget,
      remaining: Math.max(0, company.monthly_budget - monthlyTotal),
      percentUsed: (monthlyTotal / company.monthly_budget) * 100,
    },
    last30Days: last30Days || [],
  }
}

export async function trackCost(
  agentId: string,
  companyId: string,
  service: 'claude' | 'email-sync' | 'storage',
  inputTokens: number,
  outputTokens: number,
  cost: number
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

  // Insert cost tracking
  const { error: trackError } = await supabase
    .from('cost_tracking')
    .insert({
      agent_id: agentId,
      company_id: companyId,
      service,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_cost: cost,
    })

  if (trackError) {
    console.error('Failed to track cost:', trackError)
  }

  // Update company's current month spend
  const { data: company } = await supabase
    .from('companies')
    .select('current_month_spend, total_spend')
    .eq('id', companyId)
    .single()

  if (company) {
    await supabase
      .from('companies')
      .update({
        current_month_spend: (company.current_month_spend || 0) + cost,
        total_spend: (company.total_spend || 0) + cost,
      })
      .eq('id', companyId)
  }

  // Update daily summary
  const today = new Date().toISOString().split('T')[0]
  const { data: existingSummary } = await supabase
    .from('daily_cost_summary')
    .select('*')
    .eq('company_id', companyId)
    .eq('date', today)
    .single()

  if (existingSummary) {
    const updateData: any = {
      token_count: (existingSummary.token_count || 0) + inputTokens + outputTokens,
      total_cost: (existingSummary.total_cost || 0) + cost,
    }

    if (service === 'claude') {
      updateData.claude_cost = (existingSummary.claude_cost || 0) + cost
    } else if (service === 'email-sync') {
      updateData.email_sync_cost = (existingSummary.email_sync_cost || 0) + cost
    } else if (service === 'storage') {
      updateData.storage_cost = (existingSummary.storage_cost || 0) + cost
    }

    await supabase
      .from('daily_cost_summary')
      .update(updateData)
      .eq('id', existingSummary.id)
  } else {
    const insertData: any = {
      company_id: companyId,
      date: today,
      token_count: inputTokens + outputTokens,
      total_cost: cost,
    }

    if (service === 'claude') {
      insertData.claude_cost = cost
    } else if (service === 'email-sync') {
      insertData.email_sync_cost = cost
    } else if (service === 'storage') {
      insertData.storage_cost = cost
    }

    await supabase
      .from('daily_cost_summary')
      .insert(insertData)
  }
}

export async function getTotalStats() {
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Check if admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!adminUser?.can_view_all_companies) {
    throw new Error('Only admins can view total stats')
  }

  // Get total companies
  const { data: companies, count } = await supabase
    .from('companies')
    .select('*', { count: 'exact' })

  // Get today's total costs
  const today = new Date().toISOString().split('T')[0]
  const { data: todaysCosts } = await supabase
    .from('daily_cost_summary')
    .select('total_cost, claude_cost, email_sync_cost, storage_cost')
    .eq('date', today)

  const todayTotal = todaysCosts?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0

  // Get this month's total
  const monthStart = new Date()
  monthStart.setDate(1)
  const monthStartStr = monthStart.toISOString().split('T')[0]

  const { data: monthCosts } = await supabase
    .from('daily_cost_summary')
    .select('total_cost')
    .gte('date', monthStartStr)

  const monthlyTotal = monthCosts?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0

  return {
    totalCompanies: count || 0,
    today: {
      total: todayTotal,
    },
    month: {
      total: monthlyTotal,
      average: count ? monthlyTotal / (count || 1) : 0,
    },
    companies,
  }
}
