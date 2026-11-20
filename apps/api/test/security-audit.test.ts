import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

describe('Cloudflare Security Audit Suite (Defensive Verification)', () => {
  let app: FastifyInstance;
  let citizenToken: string;
  let pendingReportId: string;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();

    // Register a test citizen
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        name: 'Warga Uji Keamanan',
        phone: '081299990001',
        password: 'PasswordSuperAman2026!',
        rt: '03',
        rw: '02',
        dusun: 'Kemitir Kidul',
        inviteCode: 'KEMITIR-RT03',
        consent: true,
      },
    });
    const regBody = JSON.parse(regRes.body);
    citizenToken = regBody.data?.accessToken;

    // Create a private pending report
    const repRes = await app.inject({
      method: 'POST',
      url: '/api/v1/reports',
      headers: {
        authorization: `Bearer ${citizenToken}`,
      },
      payload: {
        category: 'Krisis Air Bersih Rumah Tangga',
        description: 'Laporan uji keamanan privat yang belum diverifikasi petugas.',
        geometry: {
          type: 'Point',
          coordinates: [110.315, -7.228],
        },
        accuracyMeters: 8,
      },
    });
    const repBody = JSON.parse(repRes.body);
    pendingReportId = repBody.data?.id;
  });

  afterAll(async () => {
    await app.close();
  });

  // =========================================================================
  // SEC-01: Spatial Query Parameterization & SQL Injection Immunity
  // =========================================================================
  describe('SEC-01: Spatial Query Parameterization & Table Whitelist', () => {
    it('safely handles valid bbox queries with parameterized values', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/layers/batas-desa/features?bbox=110.30,-7.24,110.33,-7.21',
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.type).toBe('FeatureCollection');
    });

    it('deflects SQL injection attempts in bbox parameter', async () => {
      const maliciousPayloads = [
        "110.30,-7.24,110.33,-7.21; DROP TABLE users;--",
        "110.30' OR '1'='1",
        "NaN,NaN,NaN,NaN",
        "110.30,-7.24,110.33", // incomplete 3 parts
      ];

      for (const payload of maliciousPayloads) {
        const res = await app.inject({
          method: 'GET',
          url: `/api/v1/layers/batas-desa/features?bbox=${encodeURIComponent(payload)}`,
        });
        // System must handle gracefully (200 with fallback/valid data or 400), NEVER 500 SQL syntax error
        expect(res.statusCode).not.toBe(500);
        expect(res.statusCode).toBe(200);
      }
    });

    it('rejects unknown or arbitrary layer slugs with 404 (Layer Whitelist)', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/layers/unknown-layer/features',
      });
      expect(res.statusCode).toBe(404);
      const body = JSON.parse(res.body);
      expect(body.error.code).toBe('LAYER_NOT_FOUND');
    });
  });

  // =========================================================================
  // SEC-02: Authentication & Information Enumeration Resistance
  // =========================================================================
  describe('SEC-02: Authentication Oracle Prevention', () => {
    it('returns generic 401 error message for non-existent users (no phone enumeration)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          phone: '089999999999', // non-existent
          password: 'RandomPassword123!',
        },
      });

      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.body);
      expect(body.error.code).toBe('INVALID_CREDENTIALS');
      // Must not leak whether phone exists or password was wrong
      expect(body.error.message).toBe('Nomor telepon atau kata sandi tidak valid');
    });

    it('returns identical 401 error for existing user with wrong password', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          phone: '081299990001', // existing user
          password: 'IncorrectPassword!',
        },
      });

      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.body);
      expect(body.error.code).toBe('INVALID_CREDENTIALS');
      expect(body.error.message).toBe('Nomor telepon atau kata sandi tidak valid');
    });
  });

  // =========================================================================
  // SEC-03: IDOR Defense & Oracle Prevention
  // =========================================================================
  describe('SEC-03: IDOR Defense on Sensitive Reports', () => {
    it('returns 404 (NOT 403) when an anonymous user accesses a pending report', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/v1/reports/${pendingReportId}`,
      });

      // 404 prevents malicious actors from checking if specific report IDs exist
      expect(res.statusCode).toBe(404);
      const body = JSON.parse(res.body);
      expect(body.error.code).toBe('NOT_FOUND');
    });

    it('returns 404 when another citizen accesses someone elses pending report', async () => {
      // Register a second citizen
      const reg2 = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          name: 'Warga Kedua',
          phone: '081299990002',
          password: 'PasswordSuperAman2026!',
          rt: '01',
          rw: '01',
          dusun: 'Kemitir Lor',
          inviteCode: 'KEMITIR-RT01',
          consent: true,
        },
      });
      const token2 = JSON.parse(reg2.body).data?.accessToken;

      const res = await app.inject({
        method: 'GET',
        url: `/api/v1/reports/${pendingReportId}`,
        headers: {
          authorization: `Bearer ${token2}`,
        },
      });

      expect(res.statusCode).toBe(404);
      const body = JSON.parse(res.body);
      expect(body.error.code).toBe('NOT_FOUND');
    });

    it('allows the report author to access their own pending report', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/v1/reports/${pendingReportId}`,
        headers: {
          authorization: `Bearer ${citizenToken}`,
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.id).toBe(pendingReportId);
    });
  });

  // =========================================================================
  // SEC-04: Tile Bounding Coordinate Integrity
  // =========================================================================
  describe('SEC-04: Web Mercator Tile Bounds Enforcement', () => {
    it('rejects negative zoom levels or overflow coordinates with 400', async () => {
      const invalidTileUrls = [
        '/api/v1/tiles/batas-desa/-1/0/0.mvt',
        '/api/v1/tiles/batas-desa/25/0/0.mvt', // zoom > 22
        '/api/v1/tiles/batas-desa/2/100/100.mvt', // x, y >= 2^2
      ];

      for (const url of invalidTileUrls) {
        const res = await app.inject({
          method: 'GET',
          url,
        });
        expect(res.statusCode).toBe(400);
        const body = JSON.parse(res.body);
        expect(body.error.code).toBe('INVALID_TILE_COORD');
      }
    });
  });

  // =========================================================================
  // SEC-05: Malicious Bot & Vulnerability Scanner Blocking
  // =========================================================================
  describe('SEC-05: Malicious Bot & Vulnerability Scanner Blocking', () => {
    it('blocks aggressive security scanners (sqlmap, nikto, masscan) with 403', async () => {
      const maliciousUserAgents = [
        'sqlmap/1.6.12#stable (https://sqlmap.org)',
        'Mozilla/5.0 (compatible; Nikto/2.1.6)',
        'masscan/1.3.2',
        'zgrab/0.x',
        'acunetix-scanner-v12',
      ];

      for (const ua of maliciousUserAgents) {
        const res = await app.inject({
          method: 'GET',
          url: '/api/v1/layers',
          headers: {
            'user-agent': ua,
          },
        });
        expect(res.statusCode).toBe(403);
        const body = JSON.parse(res.body);
        expect(body.error.code).toBe('BOT_ACCESS_DENIED');
      }
    });

    it('allows legitimate human browser traffic', async () => {
      const normalUa = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/layers',
        headers: {
          'user-agent': normalUa,
        },
      });
      expect(res.statusCode).toBe(200);
    });
  });

  // =========================================================================
  // SEC-06: Honeypot Trap Defense (Anti-Spam Bot)
  // =========================================================================
  describe('SEC-06: Honeypot Trap Defense (Anti-Spam Bot)', () => {
    it('catches and rejects automated bots that populate invisible honeypot fields', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          phone: '081234567890',
          password: 'KemitirTangguh2026!',
          _hp_trap: 'automated_spam_bot_payload',
        },
      });

      expect(res.statusCode).toBe(403);
      const body = JSON.parse(res.body);
      expect(body.error.code).toBe('BOT_TRAP_TRIGGERED');
    });
  });

  // =========================================================================
  // SEC-07: Cloudflare Turnstile Verification
  // =========================================================================
  describe('SEC-07: Cloudflare Turnstile Human Verification', () => {
    it('accepts valid Turnstile challenge token for registration', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          name: 'Warga Turnstile Sukses',
          phone: '081299990099',
          password: 'PasswordAman2026!',
          rt: '02',
          rw: '01',
          dusun: 'Kemitir Lor',
          consent: true,
          turnstileToken: '1x00000000000000000000AA',
        },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.data.user.name).toBe('Warga Turnstile Sukses');
      expect(body.data.accessToken).toBeDefined();
    });

    it('rejects invalid Turnstile token with 403 BOT_VERIFICATION_FAILED', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          name: 'Warga Bot Penyerang',
          phone: '081299990098',
          password: 'PasswordAman2026!',
          rt: '02',
          rw: '01',
          dusun: 'Kemitir Lor',
          consent: true,
          turnstileToken: 'invalid',
        },
      });

      expect(res.statusCode).toBe(403);
      const body = JSON.parse(res.body);
      expect(body.error.code).toBe('BOT_VERIFICATION_FAILED');
    });
  });

  // =========================================================================
  // SEC-08: Credential Authenticated Encryption (AES-256-GCM)
  // =========================================================================
  describe('SEC-08: Credential Authenticated Encryption (AES-256-GCM)', () => {
    it('encrypts credentials with authenticated tag and decrypts accurately', async () => {
      const { encryptCredential, decryptCredential } = await import('../src/lib/crypto');
      const sensitiveSecret = 'SuperSecretDbPassword#2026!KemitirSecure';

      const encrypted = encryptCredential(sensitiveSecret);
      expect(encrypted.format).toBe('aes-256-gcm');
      expect(encrypted.encoded).toContain('enc:v1:');

      const decrypted = decryptCredential(encrypted.encoded);
      expect(decrypted).toBe(sensitiveSecret);
    });

    it('detects tampering and refuses decryption on altered cipher or tag', async () => {
      const { encryptCredential, decryptCredential } = await import('../src/lib/crypto');
      const sensitiveSecret = 'TopSecretInfrastructureCoordinate';

      const encrypted = encryptCredential(sensitiveSecret);
      const parts = encrypted.encoded.split(':');
      // Tamper with the ciphertext (replace last character)
      const tamperedCipher = parts[5].slice(0, -2) + 'ff';
      const tamperedEncoded = `${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}:${tamperedCipher}`;

      expect(() => decryptCredential(tamperedEncoded)).toThrow();
    });
  });
});
