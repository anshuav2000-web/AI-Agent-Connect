-- ============================================================
-- HiTech AI — PostgreSQL Schema
-- Run this file to set up all tables from scratch
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
  id            SERIAL PRIMARY KEY,
  full_name     TEXT NOT NULL,
  company_name  TEXT,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL,
  country       TEXT NOT NULL,
  requirement   TEXT NOT NULL,
  console_model TEXT,
  referral_source TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_settings (
  id         SERIAL PRIMARY KEY,
  label      TEXT NOT NULL DEFAULT 'Primary Webhook',
  url        TEXT NOT NULL,
  enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id         SERIAL PRIMARY KEY,
  key        TEXT NOT NULL UNIQUE,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id            SERIAL PRIMARY KEY,
  webhook_url   TEXT NOT NULL,
  payload       JSONB,
  status        INTEGER,
  success       BOOLEAN NOT NULL DEFAULT FALSE,
  response_body TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id          SERIAL PRIMARY KEY,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   INTEGER,
  detail      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status       ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at   ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email        ON leads(email);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_ts    ON webhook_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_ts   ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_settings_key  ON site_settings(key);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER webhook_settings_updated_at
  BEFORE UPDATE ON webhook_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
