-- Admin/Owner Schema Extension

-- Companies table (tracks all customer organizations)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  subscription_tier VARCHAR DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  monthly_budget DECIMAL(10, 2) DEFAULT 100.00,
  current_month_spend DECIMAL(10, 2) DEFAULT 0,
  total_spend DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agents table (one agent per company)
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
  agent_id VARCHAR NOT NULL UNIQUE,
  agent_name VARCHAR NOT NULL,
  memory JSONB DEFAULT '{}'::jsonb,
  soul JSONB DEFAULT '{}'::jsonb,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cost tracking table (tracks Claude API usage per company)
CREATE TABLE IF NOT EXISTS cost_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  service VARCHAR NOT NULL CHECK (service IN ('claude', 'email-sync', 'storage')),
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10, 4),
  cost_per_mtok DECIMAL(10, 6),
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily cost summary (aggregated per company per day)
CREATE TABLE IF NOT EXISTS daily_cost_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  claude_cost DECIMAL(10, 4) DEFAULT 0,
  email_sync_cost DECIMAL(10, 4) DEFAULT 0,
  storage_cost DECIMAL(10, 4) DEFAULT 0,
  total_cost DECIMAL(10, 4) DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  UNIQUE(company_id, date),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table (separate from regular users)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_super_admin BOOLEAN DEFAULT false,
  can_view_all_companies BOOLEAN DEFAULT false,
  can_manage_companies BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_agents_company ON agents(company_id);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_company ON cost_tracking(company_id);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_date ON cost_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_summary_company_date ON daily_cost_summary(company_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_summary_date ON daily_cost_summary(date DESC);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_cost_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin access
CREATE POLICY "admins_see_all_companies" ON companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid() AND can_view_all_companies
    )
  );

CREATE POLICY "companies_see_own_data" ON companies
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "admins_update_companies" ON companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid() AND can_manage_companies
    )
  );

CREATE POLICY "admins_see_all_agents" ON agents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid() AND can_view_all_companies
    )
  );

CREATE POLICY "companies_see_own_agents" ON agents
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

CREATE POLICY "admins_see_all_costs" ON cost_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid() AND can_view_all_companies
    )
  );

CREATE POLICY "companies_see_own_costs" ON cost_tracking
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

CREATE POLICY "admins_see_all_summaries" ON daily_cost_summary
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE id = auth.uid() AND can_view_all_companies
    )
  );

CREATE POLICY "companies_see_own_summaries" ON daily_cost_summary
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );
