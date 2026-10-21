-- ==============================================================================
-- Seed: 0001_seed_dev.sql
-- Development data for Desa Kemitir, Kecamatan Sumowono, Kabupaten Semarang
-- Coordinates centered around [110.3155, -7.2285] (WGS 84 / EPSG:4326)
-- ==============================================================================

-- 1. Initial Admin & Validator Users
-- Password for all seed users is: KemitirTangguh2026! (hashed using bcrypt/argon)
INSERT INTO users (id, name, phone_hash, role, rt, rw, dusun, status, consent_at)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Administrator Desa Kemitir', 'hash_admin_kemitir_081234567890', 'admin', '01', '01', 'Kemitir', 'active', NOW()),
  ('a0000000-0000-0000-0000-000000000002', 'Bapak Kadus Kemitir Kidul', 'hash_validator_081234567891', 'validator', '02', '01', 'Kemitir Kidul', 'active', NOW()),
  ('a0000000-0000-0000-0000-000000000003', 'Warga Contoh RT 01', 'hash_citizen_081234567892', 'citizen', '01', '01', 'Kemitir Lor', 'active', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Layers Registry
INSERT INTO layers (slug, title, type, geometry_type, source, version, published, style_json)
VALUES
  ('batas-desa', 'Batas Administrasi Desa Kemitir', 'base', 'MultiPolygon', 'Pemerintah Desa / Geodesi UNDIP', 'v1.0', true, '{"fillColor": "#6B7280", "fillOpacity": 0.1, "strokeColor": "#151A22", "strokeWidth": 2}'),
  ('bahaya-kekeringan', 'Peta Bahaya Kekeringan (Drought Hazard)', 'hazard', 'Geometry', 'Analisis Tim Geodesi KKN UNDIP 2026', 'v1.0', true, '{"property": "zone_class", "colors": {"low": "#16A34A", "medium": "#EAB308", "high": "#F97316", "very_high": "#DC2626"}}'),
  ('risiko-kekeringan', 'Peta Risiko Kekeringan (Drought Risk)', 'risk', 'Geometry', 'Analisis Tim Geodesi KKN UNDIP 2026', 'v1.0', true, '{"property": "risk_class", "colors": {"low": "#16A34A", "medium": "#EAB308", "high": "#F97316", "very_high": "#DC2626"}}'),
  ('sumber-air', 'Inventarisasi Sumber Air Bersih', 'water', 'Point', 'Survei Lapangan Tim KKN UNDIP', 'v1.0', true, '{"markerColor": "#2563EB", "icon": "droplet"}'),
  ('peta-partisipatif', 'Peta Partisipatif Warga', 'participatory', 'Geometry', 'Partisipasi Warga Desa Kemitir', 'v1.0', true, '{"strokeColor": "#7C3AED", "fillColor": "#7C3AED", "fillOpacity": 0.3}')
ON CONFLICT (slug) DO NOTHING;

-- 3. Administrative Boundary of Desa Kemitir (Sample Polygon)
INSERT INTO admin_boundaries (id, level, name, geom)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'desa',
  'Desa Kemitir',
  ST_Multi(ST_GeomFromText('POLYGON((
    110.3050 -7.2200,
    110.3250 -7.2200,
    110.3280 -7.2350,
    110.3100 -7.2400,
    110.3020 -7.2300,
    110.3050 -7.2200
  ))', 4326))
) ON CONFLICT (id) DO NOTHING;

-- 4. Sample Threat Zones (Hazard)
INSERT INTO threat_zones (id, zone_class, score, attributes, geom)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'high',
    0.785,
    '{"rainfall_mm": 110, "ndvi": 0.28, "slope_pct": 25}'::jsonb,
    ST_GeomFromText('POLYGON((
      110.3120 -7.2250,
      110.3220 -7.2250,
      110.3200 -7.2330,
      110.3100 -7.2310,
      110.3120 -7.2250
    ))', 4326)
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'medium',
    0.450,
    '{"rainfall_mm": 160, "ndvi": 0.45, "slope_pct": 12}'::jsonb,
    ST_GeomFromText('POLYGON((
      110.3050 -7.2200,
      110.3120 -7.2200,
      110.3100 -7.2310,
      110.3030 -7.2280,
      110.3050 -7.2200
    ))', 4326)
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Sample Water Sources
INSERT INTO water_sources (id, name, type, condition, status, usage, debit, access_notes, geom)
VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'Tuk Mulyo (Mata Air Utama)',
    'Mata Air',
    'Baik / Layak',
    'Aktif Mengalir',
    'Air Minum & Domestik',
    12.5,
    'Jalan setapak beton 200m dari jalan dusun, motor bisa sampai gapura.',
    ST_SetSRID(ST_MakePoint(110.3142, -7.2268), 4326)
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'Sumur Bor Sentral RW 02',
    'Sumur Bor',
    'Baik / Layak',
    'Aktif Mengalir',
    'Domestik & Fasilitas Umum',
    8.0,
    'Di samping balai RT 02 RW 02, akses mobil truk tangki sangat mudah.',
    ST_SetSRID(ST_MakePoint(110.3185, -7.2295), 4326)
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'Tuk Gedang Kidul',
    'Mata Air',
    'Debit Menurun',
    'Kritis saat Kemarau',
    'Irigasi Sawah & Ternak',
    2.1,
    'Akses jalan tanah curam, rawan licin saat hujan.',
    ST_SetSRID(ST_MakePoint(110.3210, -7.2340), 4326)
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Sample Articles
INSERT INTO articles (id, title, slug, body, category, published_at)
VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'Panduan Mitigasi Kekeringan dan Hemat Air Bersih Rumah Tangga',
    'panduan-mitigasi-kekeringan-kemitir',
    'Kekeringan merupakan salah satu ancaman tahunan di kawasan lereng perbukitan Sumowono. Langkah mitigasi mandiri warga meliputi penampungan air hujan, pemeliharaan bak tampung komunal, serta pelaporan dini penurunan debit mata air.',
    'Mitigasi Bencana',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;
