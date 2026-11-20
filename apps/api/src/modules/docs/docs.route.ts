import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';

const openApiPath = path.resolve(__dirname, 'openapi.json');
let openApiSpec: any = null;
try {
  openApiSpec = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
  openApiSpec.info = {
    title: 'Kemitir Tangguh Bencana — Drought Mitigation Web & Mobile GIS API',
    version: '1.0.0',
    description:
      'REST & Spatial Vector Tile (MVT) API untuk sistem pemantauan mitigasi kekeringan Desa Kemitir, Kec. Sumowono, Kab. Semarang (KKN Tematik Undip 2026). Mendukung Dual-Client Authentication, sinkronisasi laporan offline, serta streaming Mapbox Vector Tiles.',
  };
} catch {
  openApiSpec = { openapi: '3.1.0', info: { title: 'Kemitir API', version: '1.0.0' }, paths: {} };
}

const SCALAR_DOCS_HTML = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kemitir Tangguh Bencana — Dokumentasi API Resmi</title>
    <style>body { margin: 0; padding: 0; }</style>
  </head>
  <body>
    <script id="api-reference" data-url="/api/v1/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;

export async function docsRoutes(fastify: FastifyInstance) {
  // OpenAPI 3.1 JSON Specification
  fastify.get('/api/v1/openapi.json', async (_request, reply) => {
    return reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .header('Cache-Control', 'public, max-age=3600')
      .send(openApiSpec);
  });

  // Scalar Interactive API Reference UI
  fastify.get('/api/v1/docs', async (_request, reply) => {
    return reply
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(SCALAR_DOCS_HTML);
  });
}

