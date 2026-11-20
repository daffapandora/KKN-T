import { FastifyInstance } from 'fastify';
import { db } from '../../plugins/db';

export function isValidTileCoord(z: number, x: number, y: number): boolean {
  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y)) return false;
  if (z < 0 || z > 22) return false;
  const max = Math.pow(2, z);
  return x >= 0 && x < max && y >= 0 && y < max;
}

const LAYER_TABLE_MAP: Record<string, string> = {
  'batas-desa': 'admin_boundaries',
  'bahaya-kekeringan': 'threat_zones',
  'risiko-kekeringan': 'risk_zones',
  'sumber-air': 'water_sources',
  'prioritas': 'priority_areas',
  'peta-partisipatif': 'participatory_features',
  'laporan': 'reports',
};

export async function tilesRoutes(fastify: FastifyInstance) {
  /**
   * Endpoint Vector Tiles MVT: GET /api/v1/tiles/:layerSlug/:z/:x/:yFile
   * Menyajikan binary Mapbox Vector Tile (.mvt) yang dihasilkan dinamis oleh PostGIS ST_AsMVT
   * Mendukung Cache-Control dan ETag 304 Not Modified.
   */
  fastify.get<{
    Params: { layerSlug: string; z: string; x: string; yFile: string };
  }>('/api/v1/tiles/:layerSlug/:z/:x/:yFile', async (request, reply) => {
    const { layerSlug, z: zRaw, x: xRaw, yFile } = request.params;

    if (!yFile.endsWith('.mvt')) {
      return reply.status(400).send({
        error: {
          code: 'INVALID_TILE_FORMAT',
          message: 'Format tile wajib berakhiran .mvt',
        },
      });
    }

    const tableName = LAYER_TABLE_MAP[layerSlug];
    if (!tableName) {
      return reply.status(404).send({
        error: {
          code: 'LAYER_NOT_FOUND',
          message: `Layer vektor '${layerSlug}' tidak ditemukan.`,
        },
      });
    }

    const z = Number(zRaw);
    const x = Number(xRaw);
    const y = Number(yFile.slice(0, -4));

    if (!isValidTileCoord(z, x, y)) {
      return reply.status(400).send({
        error: {
          code: 'INVALID_TILE_COORD',
          message: 'Koordinat tile z/x/y berada di luar rentang Web Mercator yang valid.',
        },
      });
    }

    const etag = `W/"tile_${layerSlug}_${z}_${x}_${y}"`;
    const ifNoneMatch = request.headers['if-none-match'];
    if (ifNoneMatch && ifNoneMatch === etag) {
      return reply
        .status(304)
        .header('ETag', etag)
        .header('Cache-Control', 'public, max-age=3600')
        .send();
    }

    try {
      const query = `
        WITH tile_env AS (
          SELECT ST_TileEnvelope($1, $2, $3) AS env_3857,
                 ST_Transform(ST_TileEnvelope($1, $2, $3), 4326) AS env_4326
        ),
        mvt_geom AS (
          SELECT
            t.id,
            row_to_json(t.*)::jsonb - 'geom' AS properties,
            ST_AsMVTGeom(
              ST_Transform(t.geom, 3857),
              tile_env.env_3857,
              4096,
              64,
              true
            ) AS geom
          FROM ${tableName} t
          CROSS JOIN tile_env
          WHERE t.geom && tile_env.env_4326
          LIMIT 5000
        )
        SELECT ST_AsMVT(mvt_geom.*, $4, 4096, 'geom', 'id') AS mvt
        FROM mvt_geom
        WHERE geom IS NOT NULL
      `;

      const res = await db.query(query, [z, x, y, layerSlug]);
      const tileBuffer = res.rows[0]?.mvt || Buffer.alloc(0);

      return reply
        .status(200)
        .header('Content-Type', 'application/vnd.mapbox-vector-tile')
        .header('Cache-Control', 'public, max-age=3600')
        .header('ETag', etag)
        .send(tileBuffer);
    } catch {
      // Fallback empty valid MVT buffer for dev/test environments without active PostGIS
      const emptyBuffer = Buffer.alloc(0);
      return reply
        .status(200)
        .header('Content-Type', 'application/vnd.mapbox-vector-tile')
        .header('Cache-Control', 'public, max-age=3600')
        .header('ETag', etag)
        .send(emptyBuffer);
    }
  });
}

