-- ==============================================================================
-- Migration: 0001_initial_schema.sql
-- Description: Core spatial schema for Kemitir Tangguh Bencana (WebGIS + Mobile)
-- SRID: 4326 (WGS 84)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone_hash VARCHAR(255) NOT NULL UNIQUE,
    phone_encrypted TEXT,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'citizen' CHECK (role IN ('public', 'citizen', 'validator', 'admin')),
    rt VARCHAR(10),
    rw VARCHAR(10),
    dusun VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    consent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_phone_hash ON users(phone_hash);

-- 3. Layers Registry Table
CREATE TABLE IF NOT EXISTS layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('hazard', 'exposure', 'risk', 'base', 'water', 'access', 'priority', 'participatory')),
    geometry_type VARCHAR(50) NOT NULL,
    source VARCHAR(255),
    version VARCHAR(50) NOT NULL DEFAULT 'v1.0',
    published BOOLEAN NOT NULL DEFAULT true,
    style_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_layers_type ON layers(type);
CREATE INDEX IF NOT EXISTS idx_layers_published ON layers(published);

-- 4. Administrative Boundaries (Desa, Dusun, RW, RT)
CREATE TABLE IF NOT EXISTS admin_boundaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(50) NOT NULL CHECK (level IN ('desa', 'dusun', 'rw', 'rt')),
    name VARCHAR(255) NOT NULL,
    geom geometry(MultiPolygon, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_boundaries_geom ON admin_boundaries USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_admin_boundaries_level ON admin_boundaries(level);

-- 5. Threat Zones (Drought Hazard)
CREATE TABLE IF NOT EXISTS threat_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_class VARCHAR(50) NOT NULL CHECK (zone_class IN ('low', 'medium', 'high', 'very_high', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi')),
    score NUMERIC(6, 3),
    attributes JSONB DEFAULT '{}'::jsonb,
    geom geometry(Geometry, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threat_zones_geom ON threat_zones USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_threat_zones_class ON threat_zones(zone_class);

-- 6. Exposure Zones
CREATE TABLE IF NOT EXISTS exposure_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    population INT DEFAULT 0,
    facilities JSONB DEFAULT '{}'::jsonb,
    farmland NUMERIC(10, 2) DEFAULT 0,
    geom geometry(Geometry, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exposure_zones_geom ON exposure_zones USING GIST(geom);

-- 7. Risk Zones (Hazard x Exposure)
CREATE TABLE IF NOT EXISTS risk_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_class VARCHAR(50) NOT NULL CHECK (risk_class IN ('low', 'medium', 'high', 'very_high', 'Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi')),
    score NUMERIC(6, 3),
    geom geometry(Geometry, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_zones_geom ON risk_zones USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_risk_zones_class ON risk_zones(risk_class);

-- 8. Water Sources Inventory
CREATE TABLE IF NOT EXISTS water_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    condition VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL,
    usage VARCHAR(255) NOT NULL,
    debit NUMERIC(8, 2), -- liter/detik
    access_notes TEXT,
    geom geometry(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_water_sources_geom ON water_sources USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_water_sources_geog ON water_sources USING GIST(geography(geom));
CREATE INDEX IF NOT EXISTS idx_water_sources_type ON water_sources(type);

-- 9. Access Routes (Roads / Paths)
CREATE TABLE IF NOT EXISTS access_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    road_condition VARCHAR(100) NOT NULL,
    geom geometry(LineString, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_routes_geom ON access_routes USING GIST(geom);

-- 10. Treatment Priority Areas
CREATE TABLE IF NOT EXISTS priority_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rank INT NOT NULL,
    score NUMERIC(6, 3) NOT NULL,
    priority_class VARCHAR(50) NOT NULL,
    rationale TEXT,
    geom geometry(Geometry, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_priority_areas_geom ON priority_areas USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_priority_areas_rank ON priority_areas(rank);

-- 11. Participatory Features (Community Mapping)
CREATE TABLE IF NOT EXISTS participatory_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    geom geometry(Geometry, 4326) NOT NULL,
    photo_ids UUID[] DEFAULT '{}'::uuid[],
    validation_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'rejected')),
    validated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    validated_at TIMESTAMPTZ,
    reject_reason TEXT,
    hazard_class VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_participatory_features_geom ON participatory_features USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_participatory_features_status ON participatory_features(validation_status);
CREATE INDEX IF NOT EXISTS idx_participatory_features_user ON participatory_features(user_id);

-- 12. Citizen Drought Reports
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    geom geometry(Point, 4326) NOT NULL,
    accuracy_m NUMERIC(8, 2) DEFAULT 0,
    photo_ids UUID[] DEFAULT '{}'::uuid[],
    validation_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reports_geom ON reports USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(validation_status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- 13. Media Uploads
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_type VARCHAR(50) NOT NULL,
    owner_id UUID,
    r2_key TEXT NOT NULL,
    mime VARCHAR(100) NOT NULL,
    size BIGINT NOT NULL,
    width INT,
    height INT,
    checksum VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_owner ON media(owner_type, owner_id);

-- 14. Articles & Educational Content
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    body TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- 15. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,
    diff JSONB,
    ip INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ==============================================================================
-- 16. Spatial Automation Functions & Triggers
-- ==============================================================================

-- Auto-derive hazard_class when a participatory feature is inserted or updated
CREATE OR REPLACE FUNCTION fn_derive_participatory_hazard_class()
RETURNS TRIGGER AS $$
DECLARE
    matched_hazard VARCHAR(50);
BEGIN
    -- Spatial intersection with threat_zones
    SELECT tz.zone_class INTO matched_hazard
    FROM threat_zones tz
    WHERE ST_Intersects(NEW.geom, tz.geom)
    ORDER BY tz.score DESC NULLS LAST
    LIMIT 1;

    NEW.hazard_class := COALESCE(matched_hazard, 'low');
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_derive_participatory_hazard_class ON participatory_features;
CREATE TRIGGER trg_derive_participatory_hazard_class
    BEFORE INSERT OR UPDATE OF geom ON participatory_features
    FOR EACH ROW
    EXECUTE FUNCTION fn_derive_participatory_hazard_class();

-- KNN Query Helper for Nearest Water Sources
CREATE OR REPLACE FUNCTION fn_nearest_water_sources(
    p_lng DOUBLE PRECISION,
    p_lat DOUBLE PRECISION,
    p_limit INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    type VARCHAR(100),
    condition VARCHAR(100),
    status VARCHAR(100),
    usage VARCHAR(255),
    debit NUMERIC(8, 2),
    access_notes TEXT,
    distance_meters DOUBLE PRECISION,
    geom geometry(Point, 4326)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ws.id,
        ws.name,
        ws.type,
        ws.condition,
        ws.status,
        ws.usage,
        ws.debit,
        ws.access_notes,
        ST_Distance(
            geography(ws.geom),
            geography(ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326))
        ) AS distance_meters,
        ws.geom
    FROM water_sources ws
    WHERE ws.deleted_at IS NULL
    ORDER BY ws.geom <-> ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;
