-- THEA V2 Database Schema
-- Run this in Supabase SQL Editor

-- 1. Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL UNIQUE,
  display_name VARCHAR,
  preferences JSONB DEFAULT '{"tone": "professional", "signature": ""}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Email accounts table (stores OAuth tokens)
CREATE TABLE IF NOT EXISTS email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  provider VARCHAR NOT NULL CHECK (provider IN ('gmail', 'outlook')),
  access_token TEXT NOT NULL, -- Encrypted
  refresh_token TEXT NOT NULL, -- Encrypted
  token_expires_at TIMESTAMP,
  last_sync_time TIMESTAMP,
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, email, provider)
);

-- 3. Emails table (main email storage)
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  message_id VARCHAR NOT NULL,
  thread_id VARCHAR,
  from_address VARCHAR NOT NULL,
  to_addresses TEXT[] DEFAULT '{}',
  cc_addresses TEXT[] DEFAULT '{}',
  subject VARCHAR,
  body_text TEXT,
  body_html TEXT,
  is_draft BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  received_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email_account_id, message_id)
);

-- 4. Email threads table
CREATE TABLE IF NOT EXISTS email_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  thread_id VARCHAR NOT NULL,
  subject VARCHAR,
  last_email_at TIMESTAMP,
  email_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email_account_id, thread_id)
);

-- 5. Response suggestions table
CREATE TABLE IF NOT EXISTS response_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  suggested_response TEXT NOT NULL,
  tone VARCHAR DEFAULT 'professional',
  tokens_used INTEGER DEFAULT 0,
  generated_at TIMESTAMP DEFAULT NOW(),
  user_accepted BOOLEAN DEFAULT false,
  user_edited_response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR NOT NULL,
  resource_id VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emails_account_received ON emails(email_account_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_message_id ON emails(email_account_id, message_id);
CREATE INDEX IF NOT EXISTS idx_email_accounts_user ON email_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_threads_account ON email_threads(email_account_id, last_email_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_email ON response_suggestions(email_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own data
CREATE POLICY "users_see_own_data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_see_own_email_accounts" ON email_accounts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "users_see_own_emails" ON emails
  FOR SELECT USING (
    email_account_id IN (
      SELECT id FROM email_accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "users_see_own_threads" ON email_threads
  FOR SELECT USING (
    email_account_id IN (
      SELECT id FROM email_accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "users_see_own_suggestions" ON response_suggestions
  FOR SELECT USING (
    email_id IN (
      SELECT id FROM emails 
      WHERE email_account_id IN (
        SELECT id FROM email_accounts WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "users_see_own_audit" ON audit_log
  FOR SELECT USING (user_id = auth.uid());

-- Insert policies (allow inserts to own data)
CREATE POLICY "users_insert_own_email_accounts" ON email_accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_insert_own_emails" ON emails
  FOR INSERT WITH CHECK (
    email_account_id IN (
      SELECT id FROM email_accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "users_insert_own_suggestions" ON response_suggestions
  FOR INSERT WITH CHECK (
    email_id IN (
      SELECT id FROM emails 
      WHERE email_account_id IN (
        SELECT id FROM email_accounts WHERE user_id = auth.uid()
      )
    )
  );
