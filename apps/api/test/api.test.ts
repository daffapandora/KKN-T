import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

describe('API Integration & Remediation Test Suite (T1, T2, T3)', () => {
  let app: FastifyInstance;
  let citizenToken: string;
  let citizenRefreshToken: string;
  let citizenId: string;
  let otherCitizenToken: string;
  let otherCitizenId: string;
  let validatorToken: string;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();

    // 1. Register Citizen A
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        name: 'Warga Kemitir RT 01',
        phone: '085811223344',
        password: 'PasswordAman123!',
        rt: '01',
        rw: '01',
        dusun: 'Kemitir',
        inviteCode: 'KEMITIR-RT01',
        consent: true,
      },
    });

    const regBody = JSON.parse(regRes.body);
    expect(regRes.statusCode).toBe(201);
    citizenToken = regBody.data.accessToken;
    citizenId = regBody.data.user.id;

    // Extract refresh token cookie
    const cookies = regRes.cookies;
    const refCookie = cookies.find((c) => c.name === 'refresh_token');
    citizenRefreshToken = refCookie ? refCookie.value : '';

    // 2. Register Citizen B
    const regBRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        name: 'Warga Kemitir RT 02',
        phone: '085899887766',
        password: 'PasswordAman456!',
        rt: '02',
        rw: '01',
        dusun: 'Kemitir',
        inviteCode: 'KEMITIR-RT02',
        consent: true,
      },
    });
    const regBBody = JSON.parse(regBRes.body);
    otherCitizenToken = regBBody.data.accessToken;
    otherCitizenId = regBBody.data.user.id;

    // 3. Login Seed Validator
    const valRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        phone: '081234567891',
        password: 'KemitirTangguh2026!',
      },
    });
    const valBody = JSON.parse(valRes.body);
    expect(valRes.statusCode).toBe(200);
    validatorToken = valBody.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  // ==========================================
  // T3: HEALTH LEAK & CORS HARDENING (AUD-02, AUD-11)
  // ==========================================
  describe('T3: Health Leak & CORS Configuration', () => {
    it('GET /health returns sanitized status without internal DB username or error disclosure', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect([200, 503]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('db');
      expect(body).toHaveProperty('version');
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('uptimeSeconds');

      // CRITICAL SECURITY ASSERTION: Internal db role/connection errors must NOT be exposed
      const rawText = res.body;
      expect(rawText).not.toContain('kemitir_user');
      expect(rawText).not.toContain('kemitir_secure_password');
      expect(rawText).not.toContain('PostgreSQL');
      expect(rawText).not.toContain('database_error');
    });

    it('GET /api/v1/health provides the same sanitized response', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/health',
      });

      expect([200, 503]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('db');
      expect(res.body).not.toContain('kemitir_user');
    });

    it('CORS enforces allow-list and rejects unlisted origin', async () => {
      // Allowed origin
      const allowedRes = await app.inject({
        method: 'GET',
        url: '/api/v1/dashboard/summary',
        headers: {
          origin: 'http://localhost:3000',
        },
      });
      expect(allowedRes.headers['access-control-allow-origin']).toBe('http://localhost:3000');

      // Disallowed origin
      const blockedRes = await app.inject({
        method: 'GET',
        url: '/api/v1/dashboard/summary',
        headers: {
          origin: 'http://malicious-domain.xyz',
        },
      });
      expect(blockedRes.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  // ==========================================
  // T2: AUTHENTICATION & RBAC MODULE (AUD-03)
  // ==========================================
  describe('T2: Auth & RBAC Module', () => {
    it('Registration rejects invalid invite code', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          name: 'Hacker Palsu',
          phone: '085811998877',
          password: 'Password123!',
          rt: '01',
          rw: '01',
          dusun: 'Kemitir',
          inviteCode: 'INVALID-CODE-XYZ',
          consent: true,
        },
      });

      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.error).toBeDefined();
    });

    it('Registration requires explicit UU PDP consent', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          name: 'Warga Tanpa Consent',
          phone: '085811998866',
          password: 'Password123!',
          rt: '01',
          rw: '01',
          dusun: 'Kemitir',
          inviteCode: 'KEMITIR-RT01',
          consent: false,
        },
      });

      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    it('Login succeeds with correct credentials and returns JWT + httpOnly cookie', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          phone: '085811223344',
          password: 'PasswordAman123!',
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.accessToken).toBeDefined();
      expect(body.data.user.name).toBe('Warga Kemitir RT 01');

      const cookies = res.cookies;
      const refCookie = cookies.find((c) => c.name === 'refresh_token');
      expect(refCookie).toBeDefined();
      expect(refCookie?.httpOnly).toBe(true);
    });

    it('Login fails with generic error on incorrect password (no enumeration leak)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          phone: '085811223344',
          password: 'SalahPassword123!',
        },
      });

      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.body);
      expect(body.error.message).toBe('Nomor telepon atau kata sandi tidak valid');
    });

    it('POST /api/v1/auth/refresh rotates refresh token successfully', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/refresh',
        cookies: {
          refresh_token: citizenRefreshToken,
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.accessToken).toBeDefined();

      const newRefCookie = res.cookies.find((c) => c.name === 'refresh_token');
      expect(newRefCookie).toBeDefined();
      expect(newRefCookie?.value).not.toBe(citizenRefreshToken);

      // Save new refresh token for next test
      const rotatedRefreshToken = newRefCookie?.value || '';

      // REUSE ATTACK: Attempting to reuse the revoked citizenRefreshToken
      const attackRes = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/refresh',
        cookies: {
          refresh_token: citizenRefreshToken, // old reused token!
        },
      });

      expect(attackRes.statusCode).toBe(401);

      // Now the whole family must be revoked; rotatedRefreshToken should also fail
      const familyCheckRes = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/refresh',
        cookies: {
          refresh_token: rotatedRefreshToken,
        },
      });
      expect(familyCheckRes.statusCode).toBe(401);
    });

    it('GET /api/v1/me returns authenticated user profile and enforces requireAuth', async () => {
      // Unauthenticated
      const unauthRes = await app.inject({
        method: 'GET',
        url: '/api/v1/me',
      });
      expect(unauthRes.statusCode).toBe(401);

      // Authenticated citizen
      const authRes = await app.inject({
        method: 'GET',
        url: '/api/v1/me',
        headers: {
          authorization: `Bearer ${citizenToken}`,
        },
      });
      expect(authRes.statusCode).toBe(200);
      const body = JSON.parse(authRes.body);
      expect(body.data.id).toBe(citizenId);
      expect(body.data.role).toBe('citizen');
    });
  });

  // ==========================================
  // T1: DATA LEAK CLOSURE & IDOR PROTECTION (AUD-01)
  // ==========================================
  describe('T1: Data Leak Closure & IDOR Protection', () => {
    let pendingReportAId: string;

    beforeAll(async () => {
      // Submit a pending report as Citizen A
      const createRes = await app.inject({
        method: 'POST',
        url: '/api/v1/reports',
        headers: {
          authorization: `Bearer ${citizenToken}`,
        },
        payload: {
          category: 'Kekeringan Lahan Pertanian',
          description: 'Lahan sawah RT 01 warga A tanah retak dan tidak ada air irigasi.',
          geometry: {
            type: 'Point',
            coordinates: [110.316, -7.228],
          },
          accuracyMeters: 5.0,
          photoIds: [],
        },
      });

      expect(createRes.statusCode).toBe(201);
      const body = JSON.parse(createRes.body);
      pendingReportAId = body.data.id;
      expect(body.data.validation_status).toBe('pending');
    });

    it('Anonymous GET /api/v1/reports returns ONLY "valid" reports and strips user_id', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/reports',
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(Array.isArray(body.data)).toBe(true);

      // Assert that NO pending or rejected reports are ever leaked to public anonymous callers
      for (const report of body.data) {
        expect(report.validation_status).toBe('valid');
        expect(report.user_id).toBeUndefined(); // Personal ID omitted
      }

      // Assert citizen A's newly submitted pending report is not in the list
      const hasPendingReport = body.data.some((r: any) => r.id === pendingReportAId);
      expect(hasPendingReport).toBe(false);
    });

    it('Citizen A GET /api/v1/reports sees valid reports PLUS their own pending report', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/reports',
        headers: {
          authorization: `Bearer ${citizenToken}`,
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      const foundMine = body.data.some((r: any) => r.id === pendingReportAId);
      expect(foundMine).toBe(true);
    });

    it('Citizen B GET /api/v1/reports does NOT see Citizen A pending report', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/reports',
        headers: {
          authorization: `Bearer ${otherCitizenToken}`,
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      const foundCitizenAReport = body.data.some((r: any) => r.id === pendingReportAId);
      expect(foundCitizenAReport).toBe(false);
    });

    it('Validator GET /api/v1/reports can view all reports including pending and filter by status', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/reports?status=pending',
        headers: {
          authorization: `Bearer ${validatorToken}`,
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      const found = body.data.some((r: any) => r.id === pendingReportAId);
      expect(found).toBe(true);
      // Validators can see user_id
      const pendingItem = body.data.find((r: any) => r.id === pendingReportAId);
      expect(pendingItem.user_id).toBe(citizenId);
    });

    it('GET /api/v1/reports/mine returns only caller reports', async () => {
      const unauthRes = await app.inject({
        method: 'GET',
        url: '/api/v1/reports/mine',
      });
      expect(unauthRes.statusCode).toBe(401);

      const authRes = await app.inject({
        method: 'GET',
        url: '/api/v1/reports/mine',
        headers: {
          authorization: `Bearer ${citizenToken}`,
        },
      });

      expect(authRes.statusCode).toBe(200);
      const body = JSON.parse(authRes.body);
      expect(body.data.some((r: any) => r.id === pendingReportAId)).toBe(true);
    });

    it('IDOR Protection on GET /api/v1/reports/:id returns 404 (not 403) to unauthorized callers', async () => {
      // 1. Citizen A (Owner) can read their pending report
      const ownerRes = await app.inject({
        method: 'GET',
        url: `/api/v1/reports/${pendingReportAId}`,
        headers: {
          authorization: `Bearer ${citizenToken}`,
        },
      });
      expect(ownerRes.statusCode).toBe(200);
      expect(JSON.parse(ownerRes.body).data.id).toBe(pendingReportAId);

      // 2. Citizen B (Attacker) attempting IDOR receives 404 NOT 403 to avoid leaking record existence
      const idorRes = await app.inject({
        method: 'GET',
        url: `/api/v1/reports/${pendingReportAId}`,
        headers: {
          authorization: `Bearer ${otherCitizenToken}`,
        },
      });
      expect(idorRes.statusCode).toBe(404);
      expect(JSON.parse(idorRes.body).error.code).toBe('NOT_FOUND');

      // 3. Anonymous caller receives 404
      const anonRes = await app.inject({
        method: 'GET',
        url: `/api/v1/reports/${pendingReportAId}`,
      });
      expect(anonRes.statusCode).toBe(404);

      // 4. Validator can access the pending report
      const validatorRes = await app.inject({
        method: 'GET',
        url: `/api/v1/reports/${pendingReportAId}`,
        headers: {
          authorization: `Bearer ${validatorToken}`,
        },
      });
      expect(validatorRes.statusCode).toBe(200);
      expect(JSON.parse(validatorRes.body).data.id).toBe(pendingReportAId);
    });
  });
});
