import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

describe('API Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health should return 200 or 503 with structured health status', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/health',
    });

    // In local dev without PostGIS container running, /health reports degraded (503) or healthy (200)
    expect([200, 503]).toContain(res.statusCode);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('uptimeSeconds');
    expect(body).toHaveProperty('database');
  });

  it('GET /api/v1/dashboard/summary should return village metrics', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/summary',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.village.name).toBe('Desa Kemitir');
    expect(body.village.areaHectares).toBe(1245);
    expect(body.village.population).toBe(4832);
  });

  it('POST /api/v1/reports should fail validation on malformed payload with Section 7 error contract', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/reports',
      payload: {
        category: 'Kategori Tidak Valid',
        description: 'pendek',
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('error');
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.details).toBeDefined();
    expect(Array.isArray(body.error.details)).toBe(true);
  });

  it('POST /api/v1/reports should accept valid drought report', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/reports',
      payload: {
        category: 'Kekeringan Lahan Pertanian',
        description: 'Lahan sawah blok B mengalami kekeringan dan tanah retak sejak 2 minggu terakhir.',
        geometry: {
          type: 'Point',
          coordinates: [110.3155, -7.2285],
        },
        accuracyMeters: 8.5,
        photoIds: [],
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.message).toBeDefined();
    expect(body.data.validation_status).toBe('pending');
  });
});
