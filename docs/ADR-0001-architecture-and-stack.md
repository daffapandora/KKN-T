# ADR-0001: Architecture, Technology Stack, and Spatial Data Decisions

**Status:** Accepted  
**Date:** 2026-10-21  
**Deciders:** Informatics Engineering Team (KKN UNDIP Desa Kemitir)  
**Context:** Kemitir Tangguh Bencana (WebGIS + Mobile PWA)

---

## 1. Context and Problem Statement
Desa Kemitir in Kecamatan Sumowono faces recurrent seasonal agricultural and clean water shortages. The KKN initiative unites:
1. **Geodesy team:** Spatial hazard modeling (NDVI/NDMI satellite imagery, rainfall, elevation, slope).
2. **Informatics team:** WebGIS platform, citizen participatory mapping, data pipeline, and decision support.

The system must serve as the central spatial repository on an affordable cloud VPS (2 vCPU / 4 GB RAM) for up to 100 concurrent users without heavy recurring cloud costs.

---

## 2. Decision Outcomes

### 2.1 PostGIS over GeoServer
* **Decision:** Self-hosted PostgreSQL 16 with PostGIS 3.4. Serve vector data directly as GeoJSON (small layers) and MVT/PMTiles (large layers).
* **Rationale:** GeoServer requires substantial Java runtime memory (often > 2 GB JVM heap), which would overwhelm a 2-4 GB VPS. PostGIS provides standard spatial SQL, KNN nearest-neighbor queries, and native ST_AsGeoJSON / ST_AsMVT with sub-50ms latency.

### 2.2 PWA First over Native Mobile Apps
* **Decision:** Progressive Web Application (PWA) with installable manifest, camera access, and HTML5 Geolocation. Capacitor APK wrapping is optional for Phase 2.
* **Rationale:** Developing native Android apps in Kotlin/Flutter would divide the 5-person engineering team across two separate codebases. PWA ensures unified UI/UX, instant zero-app-store updates, and single-source bug fixes for the mid-November 2026 handover.

### 2.3 Strict Separation of Roles & Invite Codes for Anti-Spam
* **Decision:** Citizen registration utilizes invite codes distributed by RT/RW leaders rather than costly SMS OTP gateways.
* **Rationale:** Zero budget overhead for the village while ensuring genuine residency. Unverified submissions remain in `pending` state and are never published until village validator sign-off.

### 2.4 Data Privacy (UU PDP Compliance)
* **Decision:** Hashed citizen phone numbers, EXIF GPS stripping on image upload, and public map anonymization (blurring exact coordinates of residential reports).
* **Rationale:** Compliance with Indonesian PDP Law (UU No. 27 Tahun 2022).

---

## 3. Consequences and Mitigations
- **Large Rasters:** Geotiff rasters will be pre-converted into Cloud Optimized GeoTIFF (COG) or static tiles before serving.
- **Offline Mode:** Decoupled architecture using Service Worker app shell caching now, with queued IndexedDB sync deferred to Phase 2.
