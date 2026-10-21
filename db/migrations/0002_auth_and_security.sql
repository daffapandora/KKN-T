-- ==============================================================================
-- Migration: 0002_auth_and_security.sql
-- Description: Invite codes, refresh tokens, and idempotency key tables
-- ==============================================================================

-- 1. Invite Codes Table (Anti-Spam Registration per RT/RW)
CREATE TABLE IF NOT EXISTS invite_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_hash VARCHAR(255) NOT NULL UNIQUE,
    code_display VARCHAR(50) NOT NULL,
    rt VARCHAR(10) NOT NULL,
    rw VARCHAR(10) NOT NULL,
    dusun VARCHAR(100),
    max_uses INT NOT NULL DEFAULT 50,
    used_count INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invite_codes_hash ON invite_codes(code_hash);
CREATE INDEX IF NOT EXISTS idx_invite_codes_rtrw ON invite_codes(rt, rw);

-- 2. Refresh Tokens Table (Token Family Rotation & Invalidation)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_id UUID NOT NULL,
    revoked_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- 3. Idempotency Keys Table (Prevent duplicate POST on retries without Redis)
CREATE TABLE IF NOT EXISTS idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    route VARCHAR(255) NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    response_status INT NOT NULL,
    response_body JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_key ON idempotency_keys(key);
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expires ON idempotency_keys(expires_at);

-- 4. Initial Seed Invite Codes for Desa Kemitir RT/RW
INSERT INTO invite_codes (code_hash, code_display, rt, rw, dusun, max_uses, used_count)
VALUES
  (crypt('KEMITIR-RT01', gen_salt('bf')), 'KEMITIR-RT01', '01', '01', 'Kemitir Lor', 100, 0),
  (crypt('KEMITIR-RT02', gen_salt('bf')), 'KEMITIR-RT02', '02', '01', 'Kemitir Kidul', 100, 0),
  (crypt('KEMITIR-RT03', gen_salt('bf')), 'KEMITIR-RT03', '01', '02', 'Garon', 100, 0),
  (crypt('KEMITIR-RT04', gen_salt('bf')), 'KEMITIR-RT04', '01', '03', 'Kalitengah', 100, 0),
  (crypt('KEMITIR-WARGA-2026', gen_salt('bf')), 'KEMITIR-WARGA-2026', '01', '01', 'Desa Kemitir', 500, 0)
ON CONFLICT (code_hash) DO NOTHING;
