# Kemitir Tangguh Bencana (WebGIS & Mobile PWA)

> **"Peta, Data, dan Partisipasi untuk Desa yang Lebih Tangguh"**  
> Pusat data spasial mitigasi bencana kekeringan, inventarisasi sumber air bersih, dan pemetaan partisipatif warga Desa Kemitir, Kecamatan Sumowono, Kabupaten Semarang.  
> Kolaborasi KKN Tematik Universitas Diponegoro 2026 (Tim Geodesi & Tim Informatika).

---

## 1. Ringkasan Arsitektur & Monorepo

Repositori ini dikelola menggunakan struktur **pnpm monorepo** modular:

```
├── apps/
│   ├── web/        # React 18 + Vite + Tailwind CSS + MapLibre GL JS (WebGIS & PWA)
│   └── api/        # Node.js + Fastify + TypeScript (REST API v1 + PostGIS spatial endpoints)
├── packages/
│   ├── shared/     # Skema validasi Zod, kontrak error, tipe domain, dan konstanta spasial
│   └── ui/         # Design system tokens (warna, tipografi, hairline border, status chips)
├── infra/
│   ├── docker-compose.yml   # PostGIS 16, Fastify API, Web Nginx, dan Nginx Reverse Proxy
│   ├── nginx/               # Konfigurasi reverse proxy, kompresi gzip, dan rate limiting
│   └── scripts/             # Skrip pencadangan otomatis harian ke Cloudflare R2
├── db/
│   ├── migrations/          # Berkas migrasi SQL versi (SRID 4326, 14 tabel, spatial triggers)
│   ├── seeds/               # Data awal batas Desa Kemitir, titik mata air, & zona bahaya
│   ├── migrate.ts           # Runner migrasi idempoten berbasis TypeScript
│   └── seed.ts              # Runner data awal
└── docs/
    ├── ADR-0001-architecture-and-stack.md   # Catatan keputusan arsitektur (ADR)
    ├── PRIVACY-POLICY-ID.md                 # Kebijakan privasi resmi kepatuhan UU PDP No. 27/2022
    └── RUNBOOK.md                           # Panduan operasional dan penggelaran VPS
```

---

## 2. Panduan Menjalankan Proyek (Quick Start)

### Prasyarat
- **Node.js**: v20.x atau lebih baru
- **pnpm**: v10.x (`npm install -g pnpm` atau `corepack enable`)
- **Docker & Docker Compose**

### Langkah Menjalankan Lingkungan Lokal
```bash
# 1. Salin konfigurasi environment
cp .env.example .env

# 2. Pasang seluruh dependensi monorepo
pnpm install

# 3. Jalankan container basis data PostGIS 16
docker compose up -d db

# 4. Jalankan migrasi tabel spasial dan data awal desa
pnpm db:migrate
pnpm db:seed

# 5. Jalankan aplikasi web dan backend API
pnpm dev
```

Akses layanan lokal pada:
- **WebGIS & Landing Page:** [http://localhost:3000](http://localhost:3000)
- **REST API Health Check:** [http://localhost:4000/health](http://localhost:4000/health)
- **Nginx Reverse Proxy (jika dijalankan via docker):** [http://localhost:80](http://localhost:80)

---

## 3. Menjalankan Pengujian (Tests)

```bash
# Menjalankan seluruh unit test (skema Zod, token UI, validasi copy, dan endpoint API)
pnpm test

# Menjalankan typecheck TypeScript
pnpm typecheck
```

---

## 4. Pembagian Peran Tim (5 Mahasiswa Informatika)

1. **Personil 1 (Database & Spatial Pipeline):** PostGIS schema, migrasi data Geodesi, GDAL importer, optimasi KNN.
2. **Personil 2 (Backend API & Security):** REST API Fastify, autentikasi JWT/Cookie, RBAC, Cloudflare Turnstile, UU PDP.
3. **Personil 3 (WebGIS & Layer Management):** MapLibre GL JS, multi-layer overlays, visualisasi tematik, styling GeoJSON.
4. **Personil 4 (PWA & Form Partisipatif):** Form pelaporan warga, integrasi sensor GPS & kamera ponsel, PWA installable.
5. **Personil 5 (DevOps, Design System & QA):** Docker compose, VPS IDCloudHost, Nginx reverse proxy, backup R2, unit & E2E testing.

---

## 5. Lisensi & Legalitas
Dikembangkan untuk pengabdian masyarakat Desa Kemitir oleh Tim KKN Universitas Diponegoro 2026. Dilindungi dan tunduk pada Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022).
