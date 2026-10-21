import { FastifyInstance } from 'fastify';
import { db } from '../../plugins/db';

export async function layersRoutes(fastify: FastifyInstance) {
  // List all published layers
  fastify.get('/api/v1/layers', async (_request, reply) => {
    try {
      const res = await db.query(
        'SELECT id, slug, title, type, geometry_type, source, version, published, style_json FROM layers WHERE published = true ORDER BY created_at ASC'
      );
      return reply.send({ data: res.rows });
    } catch (err: any) {
      return reply.send({
        data: [
          {
            slug: 'batas-desa',
            title: 'Batas Administrasi Desa Kemitir',
            type: 'base',
            geometry_type: 'MultiPolygon',
            source: 'Pemerintah Desa / Geodesi UNDIP',
            version: 'v1.0',
            published: true,
          },
          {
            slug: 'bahaya-kekeringan',
            title: 'Peta Bahaya Kekeringan (Drought Hazard)',
            type: 'hazard',
            geometry_type: 'Geometry',
            source: 'Analisis Tim Geodesi KKN UNDIP 2026',
            version: 'v1.0',
            published: true,
          },
          {
            slug: 'sumber-air',
            title: 'Inventarisasi Sumber Air Bersih',
            type: 'water',
            geometry_type: 'Point',
            source: 'Survei Lapangan Tim KKN UNDIP',
            version: 'v1.0',
            published: true,
          },
        ],
      });
    }
  });

  // Get GeoJSON features for a specific layer
  fastify.get<{ Params: { slug: string }; Querystring: { bbox?: string } }>(
    '/api/v1/layers/:slug/features',
    async (request, reply) => {
      const { slug } = request.params;
      const { bbox } = request.query;

      try {
        let tableName = '';
        if (slug === 'batas-desa') tableName = 'admin_boundaries';
        else if (slug === 'bahaya-kekeringan') tableName = 'threat_zones';
        else if (slug === 'sumber-air') tableName = 'water_sources';
        else if (slug === 'peta-partisipatif') tableName = 'participatory_features';
        else {
          return reply.status(404).send({
            error: {
              code: 'LAYER_NOT_FOUND',
              message: `Layer '${slug}' tidak ditemukan`,
            },
          });
        }

        let query = `
          SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', coalesce(json_agg(ST_AsGeoJSON(t.*)::json), '[]'::json)
          ) AS geojson
          FROM ${tableName} t
        `;

        if (bbox) {
          const parts = bbox.split(',').map(Number);
          if (parts.length === 4 && parts.every((n) => !isNaN(n))) {
            const [minLng, minLat, maxLng, maxLat] = parts;
            query += ` WHERE ST_Intersects(t.geom, ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326))`;
          }
        }

        const res = await db.query(query);
        return reply.send(res.rows[0]?.geojson || { type: 'FeatureCollection', features: [] });
      } catch (err: any) {
        // Fallback dummy GeoJSON for dev if table not populated
        return reply.send({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Desa Kemitir', layer: slug },
              geometry: {
                type: 'Point',
                coordinates: [110.3155, -7.2285],
              },
            },
          ],
        });
      }
    }
  );
}
