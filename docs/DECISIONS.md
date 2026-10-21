# Architecture & Implementation Decisions Log (Kemitir Tangguh Bencana)

This document records architectural, security, and operational decisions made during the remediation and development passes, as required by Section 0 & 2 of the remediation guidelines.

---

## Decision 1: Citizen Registration & Anti-Spam (Invite Codes)
- **Decision:** Registration requires an invite code distributed by RT/RW village leadership, along with an Indonesian phone number, password, and explicit UU PDP consent.
- **Rationale:** SMS/WhatsApp OTP gateways incur ongoing per-message expenses for the village budget. Invite codes ensure strict resident verification at zero cost. WhatsApp OTP is deferred to Phase 3.

## Decision 2: Token Management & Session Lifecycles
- **Decision:** Short-lived JWT access tokens (15 minutes) kept in memory or transmitted via `Authorization: Bearer <token>`, with refresh tokens stored in `httpOnly`, `Secure`, `SameSite=Lax` cookies with family rotation.
- **Rationale:** Protects citizen and validator accounts against XSS token harvesting while maintaining smooth session continuation without forcing frequent re-logins.

## Decision 3: Role-Based Access Control (RBAC) & Principle of Least Privilege
- **Decision:** Three authenticated roles: `citizen`, `validator`, `admin`. Unauthenticated users are `public`. Default is DENY.
- **Rationale:** Ensures non-public information, pending reports, and moderation workflows are strictly accessible only to authorized village personnel.

## Decision 4: Public Data Visibility & Anonymization
- **Decision:** Only records with `validation_status = 'valid'` are served to anonymous public callers. Personal identifiers (`user_id`, `phone_hash`, full names) are completely omitted from public GeoJSON outputs. Citizens can inspect their own submissions via `/api/v1/reports/mine`.
- **Rationale:** Strict compliance with Indonesian PDP Law (UU No. 27 Tahun 2022) and village protection against panic caused by unverified claims.

## Decision 5: Idempotency Implementation Without Redis
- **Decision:** Store idempotency keys in a dedicated PostgreSQL table `idempotency_keys` with a 24-hour TTL, rather than introducing Redis infrastructure.
- **Rationale:** Minimizes memory consumption and devops complexity on the 2 vCPU / 4 GB RAM target VPS while providing rock-solid protection against duplicate report submissions during network retries.

## Decision 6: Sensitive Coordinate Blurring
- **Decision:** Sensitive private residential categories are blurred on public maps (snapping to a 50m grid), while true coordinates remain accessible to verified village validators.
- **Rationale:** Prevents pinpointing private homes on public disaster maps.
