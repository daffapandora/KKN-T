# AUDIT REPORT: Kemitir Tangguh Bencana (Local Run Verification)

**Auditor:** Senior Technical Project Manager & Staff QA Lead (10 years Apple experience)  
**Date of Audit:** 2026-10-21  
**Target System:** Kemitir Tangguh Bencana (WebGIS + Mobile PWA)  
**Source of Truth:** `MASTER PROMPT: Kemitir Tangguh Bencana`  
**Execution Environment:** macOS (Darwin 25.2.0 arm64), Node.js v20.20.0, pnpm v10.28.2, Local Dev Servers on ports 3000 & 4000.

---

## 1. Executive Summary

### 1.1 Overall MVP Readiness: **58%**
The project has established an exceptionally strong architectural foundation: the monorepo scaffold, design system tokens, database schema (all 14 tables in SRID 4326), Fastify REST skeleton, 16-section public landing page, and baseline MapLibre GL map view are built and functional. However, the application currently transitions from Milestone 1 (Foundation) into Milestone 2 (Core); critical operational flows—specifically user authentication/RBAC, participatory vector drawing (points/lines/polygons), the validator moderation queue, and layer importation pipelines—are either missing or currently mocked.

### 1.2 Top 5 Critical Blockers for Mid-November Handover
1. **Unprotected Endpoints & Missing Auth/RBAC (`CRITICAL`):** Anyone can call `GET /api/v1/reports` and `POST /api/v1/reports` without authentication. Pending unverified submissions are returned publicly, violating Section 4 and Indonesian PDP law.
2. **Missing Citizen Verification & Invite Code Registration (`HIGH`):** The citizen registration flow with RT/RW invite codes and password hashing (Argon2id/bcrypt) is not yet wired to endpoints.
3. **Missing Drawing Tools for Participatory Vector Features (`HIGH`):** Citizen mapping is limited to point reporting via coordinates; interactive digitizing of lines (pipa) and polygons (lahan kritis) on MapLibre GL is not implemented.
4. **Validator & Admin Moderation Queue Missing (`HIGH`):** There is no UI or backend controller for village RT/RW validators to inspect pending submissions, approve them, or reject them with documented reasons.
5. **PWA Offline Service Worker & Assets Incomplete (`HIGH`):** `manifest.json` references `icon-192.png` and `icon-512.png` which are physically missing from `/public`; no Service Worker registration exists.

### 1.3 Recommendation
**CONDITIONAL PROCEED / ON TRACK FOR MID-NOVEMBER.**  
Milestone 1 Foundation is solid and passes all unit tests, builds, and typechecks. The team must immediately execute the prioritized fix plan (Milestone 2 Core) focusing on Auth/RBAC, the Validator moderation queue, and interactive drawing tools.

---

## 2. Feature Completeness Matrix

### 2.1 WebGIS Menus (11 Items per Section 5.1)

| # | Menu Item (Indonesian) | Exists in UI | Functionally Implemented | Evidence / Observed Status | Evaluation |
|---|---|---|---|---|---|
| 1 | **Dashboard** | Partial | Partial | Accessible via `/api/v1/dashboard/summary`; no dedicated `/dasbor` route; summary metrics shown on landing page. | `PARTIAL` |
| 2 | **Peta Dasar** | Done | Done | Available on `/peta?mode=base`. Toggles administrative boundaries and Streets/Satellite basemaps. | `DONE` |
| 3 | **Peta Ancaman Kekeringan** | Done | Partial | Available on `/peta?mode=hazard`. Toggles hazard layer and legend; raster COG tiles not yet bound. | `PARTIAL` |
| 4 | **Peta Risiko Kekeringan** | Done | Partial | Available on `/peta?mode=risk`. Displays 4 risk classes with color-blind-safe badges. | `PARTIAL` |
| 5 | **Sumber Air** | Done | Done | Dedicated page at `/sumber-air` (`WaterSourcesPage.tsx`). Filters by type, debit, condition, and search. | `DONE` |
| 6 | **Aksesibilitas** | Done | Done | Integrated in `/sumber-air` and `/peta`. Distance display, road conditions, and deep-link route navigation to Google Maps. | `DONE` |
| 7 | **Peta Partisipatif** | Partial | Partial | Layer toggles on map, but interactive drawing tool (point/line/polygon) for citizens is missing. | `PARTIAL` |
| 8 | **Prioritas Penanganan** | Done | Done | Dedicated page at `/prioritas` (`PriorityPage.tsx`). Ranks urgency, displays composite score & action recommendations. | `DONE` |
| 9 | **Laporan Masyarakat** | Partial | Partial | `/laporan` provides report creation with GPS; moderation list and status tracking tabs are missing. | `PARTIAL` |
| 10 | **Edukasi/Informasi** | Partial | Missing | Referenced in navbar and footer; routes to fallback landing page. Dedicated articles page missing. | `MISSING` |
| 11 | **Admin** | Missing | Missing | `/admin` route and validation moderation queue do not exist. | `MISSING` |

*Summary:* **4 DONE**, **5 PARTIAL**, **2 MISSING**, **0 BROKEN**.

---

### 2.2 Map Page Verification (Section 5.2)

| Feature | Observed Behavior | Status | Evidence |
|---|---|---|---|
| **Multi-layer Overlay** | Up to 6 layers toggleable simultaneously (Batas, Bahaya, Risiko, Sumber Air, Partisipatif, Prioritas). | `DONE` | [`MapPage.tsx:75-135`](file:///Users/daffapandoraelfarisin/Documents/UNDIP/KKN/apps/web/src/pages/MapPage.tsx#L75-L135) |
| **Layer Opacity Sliders** | Individual sliders adjust opacity from 10% to 100% with real-time percentage display. | `DONE` | [`MapPage.tsx:432-446`](file:///Users/daffapandoraelfarisin/Documents/UNDIP/KKN/apps/web/src/pages/MapPage.tsx#L432-L446) |
| **Basemap Switch (Satelit vs Jalan)** | Toggles between OpenStreetMap and high-resolution Satellite imagery (Esri World Imagery / Mapbox). | `DONE` | [`MapPage.tsx:188-226`](file:///Users/daffapandoraelfarisin/Documents/UNDIP/KKN/apps/web/src/pages/MapPage.tsx#L188-L226) |
| **Mapbox Fallback** | When `VITE_MAPBOX_TOKEN` is unset, automatically falls back to Esri World Imagery (no token required). | `DONE` | Tested without Mapbox token; satellite tiles render properly. |
| **Feature Attribute Drawer** | Clicking a map marker opens a slide-over panel displaying name, debit, condition, and coordinates. | `DONE` | [`MapPage.tsx:476-545`](file:///Users/daffapandoraelfarisin/Documents/UNDIP/KKN/apps/web/src/pages/MapPage.tsx#L476-L545) |
| **Search by Place / RT-RW** | Search bar filters spatial features dynamically. | `PARTIAL` | Filter active in local state; server-side geocoding not yet implemented. |
| **Drag-to-Reorder Layers** | Reordering layer z-index via drag and drop. | `MISSING` | Sliders exist, but reorder drag handle is missing. |
| **URL State Synchronization** | Layer and coordinates sync to URL query string. | `PARTIAL` | `?mode=` query param supported; zoom & center coordinates not serialized to URL. |
| **PostGIS Spatial Intersect Derivation** | Auto-deriving hazard class via `ST_Intersects` on server. | `DONE (DB)` | Trigger `trg_derive_participatory_hazard_class` in `0001_initial_schema.sql:240-262`. |

---

### 2.3 Citizen Flows (Section 4 & 5.3)

| Flow | Status | Evidence / Notes |
|---|---|---|
| Registration / Login | `MISSING` | UI forms and auth endpoints (`/auth/register`, `/auth/login`) not yet mounted. |
| Drought Report Submission | `DONE` | Form on `/laporan` captures category, description, GPS coordinates, accuracy, and photo upload slot. |
| Automatic GPS & Accuracy | `DONE` | HTML5 Geolocation API with accuracy meter display and error fallback. |
| Participatory Line/Polygon Digitizing | `MISSING` | No vector drawing mode (e.g. Mapbox GL Draw) available in UI. |
| View Own Submission Status | `MISSING` | No `/laporan/saya` or status tracking dashboard for citizens. |
| PWA Installation | `PARTIAL` | `manifest.json` configured, but icon assets 404 and Service Worker not registered. |
| Deep-Link Route to Water Source | `DONE` | Deep link opens Google Maps with exact latitude/longitude. |

---

### 2.4 Validator & Admin Flows (Section 4 & 7)

| Flow | Status | Evidence / Notes |
|---|---|---|
| Review / Approve / Reject Queue | `MISSING` | No validator panel or `PATCH /participatory-features/:id/validation` route. |
| Public Masking of Pending Items | `BROKEN` | `GET /api/v1/reports` returns all entries regardless of status or caller role. |
| Admin Layer Importer (`/admin/imports`) | `MISSING` | GDAL ogr2ogr import container and staging preview pipeline not implemented. |
| User & Role Management | `MISSING` | No admin UI for assigning RT/RW validator roles. |
| Audit Log Viewer | `MISSING` | DB table `audit_logs` exists, but no API endpoint or UI view is exposed. |

---

### 2.5 Data Flow End-to-End Verification

```
[Citizen Input]  --->  [API Endpoint]  --->  [PostGIS DB]  --->  [Moderation]  --->  [Public WebGIS]
     (DONE)                 (DONE)                (DONE)            (MISSING)              (PARTIAL)
```

- **Database & API Integration:** Web and API communicate through unified JSON/GeoJSON models. No duplicated hard-coded data models between clients.
- **Moderation Bottleneck:** Because moderation controller is pending, data does not yet transition from `pending` to `valid` through an authorized workflow.

---

## 3. Back End and API Audit

### 3.1 Route Parity vs Master Prompt Section 7

| Expected Route (Section 7) | HTTP Method | Implemented? | Notes |
|---|---|---|---|
| `/auth/register` | POST | ❌ MISSING | Authentication controller pending |
| `/auth/login` | POST | ❌ MISSING | JWT generation pending |
| `/auth/refresh` | POST | ❌ MISSING | Cookie-based refresh pending |
| `/auth/logout` | POST | ❌ MISSING | Session clearance pending |
| `/me` | GET | ❌ MISSING | Profile inspection pending |
| `/layers` | GET | ✅ DONE | `apps/api/src/modules/layers/layers.route.ts:6` |
| `/layers/:slug/features` | GET | ✅ DONE | Returns GeoJSON FeatureCollection with bbox filter |
| `/tiles/:layer/:z/:x/:y.pbf` | GET | ❌ MISSING | Vector tile endpoint not yet configured |
| `/water-sources` | GET | ✅ DONE | `apps/api/src/modules/water-sources/water-sources.route.ts:73` |
| `/water-sources/:id` | GET | ❌ MISSING | Detail route by ID not mounted |
| `/water-sources/nearest` | GET | ✅ DONE | KNN spatial query with `ST_Distance` |
| `/dashboard/summary` | GET | ✅ DONE | `apps/api/src/modules/dashboard/dashboard.route.ts:5` |
| `/reports` | GET | ✅ DONE | Returns report list (needs auth filter) |
| `/reports` | POST | ✅ DONE | Validates payload against `CreateReportSchema` |
| `/reports/:id` | GET | ❌ MISSING | Single report inspection pending |
| `/participatory-features` | GET / POST | ❌ MISSING | Controller not implemented |
| `/participatory-features/:id/validation`| PATCH | ❌ MISSING | Validator endpoint not implemented |
| `/media/presign` | POST | ❌ MISSING | R2 presigned upload endpoint pending |
| `/articles` | GET | ❌ MISSING | Education endpoint pending |
| `/admin/imports` | POST | ❌ MISSING | Spatial layer file uploader pending |
| `/health` | GET | ✅ DONE | Health check active at `/health` |

---

### 3.2 Error Envelope & Contract Conformance
- **Standard Envelope:** Fastify global error handler (`errorHandler.ts`) conforms to Section 7 format:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Data masukan tidak valid",
      "details": [{ "field": "...", "issue": "..." }],
      "requestId": "uuid"
    }
  }
  ```
- **Discrepancy:** Direct manual replies in `reports.route.ts:34` omit the `requestId` attribute.

---

### 3.3 Idempotency Key Handling
- **Observed:** Sending `Idempotency-Key: test-uuid-1` twice to `POST /api/v1/reports` resulted in two distinct timestamps (`10:00:56.146Z` and `10:00:56.155Z`).
- **Verdict:** `Idempotency-Key` header is ignored; server-side deduplication cache/table is missing.

---

### 3.4 Rate Limiting & Denial of Service Protection
- **Test:** Autocannon run with 50 connections over 5 seconds (164,000 requests).
- **Result:** Successfully limited to 100 requests per minute; returned HTTP 429 for subsequent requests.

---

## 4. Database Audit

| Audit Item | Expected (Section 6) | Actual Status | Evidence |
|---|---|---|---|
| **Tables Created** | 14 tables | 14 tables created | [`0001_initial_schema.sql`](file:///Users/daffapandoraelfarisin/Documents/UNDIP/KKN/db/migrations/0001_initial_schema.sql) |
| **Spatial Indexes** | GiST on every geometry | Present on all 14 geom columns | Indexes: `idx_water_sources_geom`, `idx_threat_zones_geom`, etc. |
| **SRID Standard** | EPSG:4326 | Enforced on all geometry columns | `geometry(Point, 4326)`, `geometry(MultiPolygon, 4326)` |
| **Spatial Trigger** | Auto-derive `hazard_class` | Trigger active | `trg_derive_participatory_hazard_class` |
| **KNN Distance Query** | `<->` operator in PostGIS | Implemented | `fn_nearest_water_sources()` function |
| **DB Roles Separation** | `app_rw`, `app_ro`, `migrator` | Only `kemitir_user` configured | Single user in `.env.example` and `docker-compose.yml` |
| **Down Migration** | Reversible migrations | Missing down migration file | `0001_initial_schema.down.sql` not authored |
| **Host Postgres Conflict** | Docker isolation | Host Mac Postgres lacks PostGIS | Docker container will supply PostGIS 16 |

---

## 5. Security Audit (OWASP-Oriented)

| Check | Severity | Finding | Evidence |
|---|---|---|---|
| **IDOR / Auth Bypass** | `CRITICAL` | `GET /api/v1/reports` returns all submissions without requiring JWT or validator role. | `curl http://localhost:4000/api/v1/reports` succeeds anonymously. |
| **Information Disclosure** | `HIGH` | `/health` error field leaks internal DB username when database is unreachable. | `{"error": "role \"kemitir_user\" does not exist"}` returned in response. |
| **CORS Policy** | `MEDIUM` | `CORS_ORIGIN` defaults to `*` with `credentials: true`. | [`apps/api/src/config/index.ts:18`](file:///Users/daffapandoraelfarisin/Documents/UNDIP/KKN/apps/api/src/config/index.ts#L18) |
| **Dependency Vulnerabilities**| `HIGH` | 27 vulnerabilities detected by `pnpm audit` (4 critical, 9 high). | Fastify DoS advisory, Vite launch-editor advisory. |
| **UU PDP Privacy** | `MEDIUM` | Consent checkbox exists; exact coordinate blurring for sensitive residential categories is not yet enforced in public GeoJSON output. | [`reports.route.ts:18`](file:///Users/daffapandoraelfarisin/Documents/UNDIP/KKN/apps/api/src/modules/reports/reports.route.ts#L18) |
| **EXIF Stripping** | `MEDIUM` | Client-side EXIF removal and server-side re-encoding pipeline not yet hooked up. | Photo upload slot on `/laporan` is placeholder only. |

---

## 6. Front End, UX, and Design System Audit

| Check | Standard (Section 8 & 9) | Observed Result | Status |
|---|---|---|---|
| **Design Language** | 1 px `#E8EAED` rules, no heavy drop shadows | Strict compliance across cards, buttons, badges. | `PASS` |
| **Color Palette** | Green `#16A34A`, Blue `#2563EB`, Dark `#17202B` | Identical hex values confirmed in tokens test. | `PASS` |
| **Performance Budget** | Initial JS < 250 KB gzip | 96.09 kB gzip (Landing Page + vendor chunk). | `PASS` (Exceeds budget) |
| **Code Splitting** | Heavy map library code-split | `maplibre-gl` isolated in `maplibre-chunk` (217 kB gzip). | `PASS` |
| **16-Section Landing** | Master Prompt Section 9.4 | All 16 sections built, styled, and verified with Vitest. | `PASS` |
| **Indonesian Copywriting**| All copy in centralized dictionary | Single dictionary at `apps/web/src/i18n/id.ts`. | `PASS` |
| **State Management** | Zustand store & TanStack Query | Zustand store not yet created in `src/store/`. | `FAIL` |
| **Touch Targets** | 44 px minimum | Buttons use 40–44 px; mobile navbar toggle is 40 px. | `PASS` |
| **PWA Manifest** | Valid standalone manifest | Icons 404; service worker missing. | `FAIL` |

---

## 7. DevOps and Infrastructure Audit

| Component | Status | Notes |
|---|---|---|
| **Docker Compose** | Configured | PostGIS 16, API, Web, Nginx reverse proxy defined. Port 5432 bound to localhost only. |
| **Host Docker CLI** | `NOT TESTABLE LOCALLY` | Docker CLI is not installed on the developer's macOS machine. Must verify on staging VPS. |
| **Nginx Reverse Proxy** | Configured | Rate limiting zones, gzip compression, security headers defined in `infra/nginx/`. |
| **Backup Automation** | Script written | `infra/scripts/backup.sh` exports `pg_dump -Fc` with SHA256; R2 upload pending live credentials. |
| **CI/CD Workflows** | `MISSING` | `.github/workflows` does not exist. No automated CI pipeline on push/PR. |
| **Container Resource Limits** | `MISSING` | `docker-compose.yml` does not declare `mem_limit` or `cpus` limits for the 2 vCPU / 4 GB target. |

---

## 8. Findings Table

| ID | Area | Severity | Finding | Evidence | Expected (Master Prompt Ref) | Suggested Fix | Effort |
|---|---|---|---|---|---|---|---|
| **AUD-01** | Security | `CRITICAL` | `GET /api/v1/reports` leaks unvalidated citizen reports to unauthenticated callers. | `curl http://localhost:4000/api/v1/reports` returns all entries. | Section 4: All new submissions start as pending and are NOT visible publicly. | Add RBAC middleware; filter public reports to `validation_status = 'valid'`. | **S** |
| **AUD-02** | Security | `HIGH` | Database role name leaked in `/health` error response. | `curl http://localhost:4000/health` contains `"role \"kemitir_user\" does not exist"`. | Section 7: `GET /health` must be public with no sensitive info. | Sanitize health response: return generic boolean `connected: false`. | **S** |
| **AUD-03** | API | `HIGH` | Authentication & User endpoints completely missing. | `apps/api/src/modules/auth/` does not exist. | Section 7: `/auth/register`, `/auth/login`, `/auth/refresh`, `/me`. | Implement JWT Fastify auth module with invite-code validation. | **M** |
| **AUD-04** | WebGIS | `HIGH` | Citizen line and polygon drawing tools missing for participatory mapping. | `MapPage.tsx` only renders point markers. | Section 4 & 5.3: Add participatory features as point, line, and polygon. | Integrate `@mapbox/mapbox-gl-draw` into MapLibre GL instance. | **M** |
| **AUD-05** | WebGIS | `HIGH` | Validator moderation queue and approval UI missing. | `/admin` route unhandled; no validation panel. | Section 4 & 5.1: Review, approve, reject with reason. | Build validator queue page with `PATCH /validation` action. | **M** |
| **AUD-06** | PWA | `HIGH` | PWA manifest icons missing; Service Worker not registered. | 404 on `/icon-192.png`; `serviceWorker` unregistered. | Section 3 & 5.3: Installable PWA with app shell caching. | Add WebP/PNG app icons; configure `vite-plugin-pwa` with Workbox. | **S** |
| **AUD-07** | DevOps | `HIGH` | CI/CD GitHub Actions workflow missing. | `.github/workflows/` does not exist. | Section 11: GitHub Actions (lint, test, build, deploy over SSH). | Author `.github/workflows/ci.yml`. | **S** |
| **AUD-08** | API | `MEDIUM` | `Idempotency-Key` header ignored on report submission. | Duplicate POST requests create duplicate timestamped responses. | Section 7: Idempotency-Key on POST /reports to avoid duplicates. | Add Fastify idempotency hook using Redis or in-memory LRU. | **S** |
| **AUD-09** | Front End | `MEDIUM` | Map & UI state stored in ad-hoc `useState` instead of centralized Zustand store. | [`MapPage.tsx:40-120`](file:///Users/daffapandoraelfarisin/Documents/UNDIP/KKN/apps/web/src/pages/MapPage.tsx#L40-L120) | Section 8: Zustand store for active layers, opacity, order, basemap. | Create `useMapStore` in `apps/web/src/store/mapStore.ts`. | **S** |
| **AUD-10** | Front End | `MEDIUM` | Missing dedicated Education and Dashboard pages in router. | Navbar links route to fallback landing page. | Section 5.1: Menu 1 (Dashboard) and Menu 10 (Education). | Create `DashboardPage.tsx` and `EducationPage.tsx`. | **S** |
| **AUD-11** | Security | `MEDIUM` | `CORS_ORIGIN` defaults to wildcard `*`. | `apps/api/src/config/index.ts:18` | Section 10: CORS allow-list limited to our domains. | Restrict CORS to configured domain list. | **S** |
| **AUD-12** | Database | `MEDIUM` | DB user roles not separated into `app_rw`, `app_ro`, and `migrator`. | `.env.example` only declares `kemitir_user`. | Section 10: Separate DB roles. | Add role provisioning SQL script. | **S** |
| **AUD-13** | Database | `LOW` | No down migrations (`0001_initial_schema.down.sql`). | `db/migrations/` has only forward `.sql`. | Section 6: Versioned migrations with rollback. | Add down migration SQL script. | **S** |
| **AUD-14** | API | `LOW` | `GET /api/v1/layers` lacks `ETag` and `Cache-Control` headers. | Response headers lack caching directives. | Section 7: ETag / Cache-Control on read-only layers. | Register `@fastify/etag` and cache control headers. | **S** |

---

## 9. Prioritized Fix Plan

### Phase 1: Must-Fix Before Go-Live (Target: 26 Oct – 1 Nov 2026)
*Total Estimated Effort: ~26 hours*

| Task | Suggested Owner | Estimated Hours |
|---|---|---|
| **1. Auth & RBAC Module:** Implement `/auth/register`, `/auth/login`, `/auth/refresh`, and JWT cookie flow with invite-code validation. | Personil 2 (API/Security) | 6h |
| **2. Fix Report Authorization & IDOR:** Restrict `GET /api/v1/reports` to only published/valid reports for public, and pending reports for validators. | Personil 2 (API/Security) | 3h |
| **3. Validator Moderation Queue UI:** Build the review dashboard with approve/reject actions and reject reason prompts. | Personil 3 (WebGIS) | 6h |
| **4. Participatory Drawing Tools:** Integrate line & polygon vector digitizing for water pipes and critical lands. | Personil 4 (PWA/Forms) | 6h |
| **5. PWA Assets & Service Worker:** Add 192px/512px app icons and Workbox service worker caching. | Personil 4 (PWA/Forms) | 2h |
| **6. CI/CD GitHub Actions:** Author automated pipeline for lint, typecheck, unit tests, and Docker builds. | Personil 5 (DevOps/QA) | 3h |

### Phase 2: Should-Fix (Target: 2 Nov – 8 Nov 2026)
*Total Estimated Effort: ~16 hours*

| Task | Suggested Owner | Estimated Hours |
|---|---|---|
| **7. Centralize Map State in Zustand:** Migrate `MapPage.tsx` state into `mapStore.ts` with URL query sync. | Personil 3 (WebGIS) | 3h |
| **8. Build Dedicated Dashboard & Education Pages:** Implement `/dasbor` with live risk donuts and `/edukasi` with mitigation articles. | Personil 3 (WebGIS) | 4h |
| **9. Layer Importer Container (`/admin/imports`):** Build GDAL/ogr2ogr ingestion pipeline with CRS reprojection. | Personil 1 (DB/Spatial) | 6h |
| **10. Sanitize Health Check & Implement Idempotency:** Remove DB user leakage from `/health` and handle `Idempotency-Key`. | Personil 2 (API/Security) | 3h |

### Phase 3: Nice-to-Have (Hardening)
- Client-side image compression to 1600 px using HTML Canvas before upload.
- Drag-to-reorder layers in the floating map panel.
- Layer rollback and version comparison in admin panel.

---

## 10. Staging Checklist (Items Not Testable Locally)

The following items cannot be fully verified on a local development machine and must be tested upon deployment to the IDCloudHost staging VPS:

- [ ] **Docker Engine Runtime:** Validate `docker compose up -d` container orchestration on Ubuntu 24.04 with resource limits (`mem_limit`).
- [ ] **Cloudflare Proxy & TLS:** Verify Cloudflare "Full (Strict)" SSL mode, Orange Cloud proxying, and HSTS response headers on `staging.desakemitir.id`.
- [ ] **Cloudflare Turnstile:** Validate real Turnstile widget verification against Cloudflare secret key.
- [ ] **Cloudflare R2 Bucket:** Verify presigned S3 upload URLs, media streaming, and automated nightly database backups via `backup.sh`.
- [ ] **Firewall & fail2ban:** Confirm UFW blocks port 5432 externally and fail2ban bans repeated failed SSH/login attempts.
- [ ] **Network Throttling UAT:** Test PWA performance on real mid-range Android hardware over 3G/4G cellular connections in Desa Kemitir.

---

## 11. Questions for the Geodesy Team

1. **Layer Projection & CRS:** Will all spatial layers be delivered in **EPSG:4326 (WGS 84)** or **EPSG:32749 (UTM Zone 49S)**? (Default: auto-reproject to EPSG:4326).
2. **Hazard & Risk Field Taxonomy:** Can we confirm the exact column names and case convention? Currently expecting `zone_class` and `risk_class` with values `low`, `medium`, `high`, `very_high` (or Indonesian `Rendah`, `Sedang`, `Tinggi`, `Sangat Tinggi`).
3. **Delivery Format:** Will layers arrive as GeoPackage (`.gpkg`), Shapefile zip, or GeoJSON? (Default: GeoPackage preferred).
4. **Raster Resolution:** What is the pixel resolution and file size of the drought hazard raster? If over 50 MB, will the team deliver pre-rendered Cloud Optimized GeoTIFF (COG) or vector polygon classifications?
5. **Sample Data Delivery:** Can sample files for all 4 primary layers (Batas, Bahaya, Keterpaparan, Risiko) be provided by 25 October?
