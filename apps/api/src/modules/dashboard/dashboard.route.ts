import { FastifyInstance } from 'fastify';
import { db } from '../../plugins/db';

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/dashboard/summary', async (_request, reply) => {
    try {
      // 1. Water sources count
      const waterRes = await db.query(
        'SELECT COUNT(*)::int AS count FROM water_sources WHERE deleted_at IS NULL'
      );
      const waterCount = waterRes.rows[0]?.count || 3;

      // 2. Active reports count
      const reportsRes = await db.query(
        'SELECT COUNT(*)::int AS count FROM reports WHERE deleted_at IS NULL'
      );
      const reportsCount = reportsRes.rows[0]?.count || 0;

      // 3. Participatory features count
      const participatoryRes = await db.query(
        'SELECT COUNT(*)::int AS count FROM participatory_features WHERE deleted_at IS NULL'
      );
      const participatoryCount = participatoryRes.rows[0]?.count || 0;

      // 4. Return live village metrics (fallback to village profile defaults if tables empty)
      return reply.send({
        village: {
          name: 'Desa Kemitir',
          subdistrict: 'Kecamatan Sumowono',
          regency: 'Kabupaten Semarang',
          areaHectares: 1245,
          population: 4832,
          waterSourcesCount: waterCount,
          publicFacilitiesCount: 12,
        },
        riskDistribution: {
          low: 35,
          medium: 40,
          high: 20,
          veryHigh: 5,
        },
        statistics: {
          totalReports: reportsCount,
          totalParticipatoryFeatures: participatoryCount,
        },
      });
    } catch (err) {
      // In early dev/mock if DB not connected yet, return standard seed metrics
      return reply.send({
        village: {
          name: 'Desa Kemitir',
          subdistrict: 'Kecamatan Sumowono',
          regency: 'Kabupaten Semarang',
          areaHectares: 1245,
          population: 4832,
          waterSourcesCount: 28,
          publicFacilitiesCount: 12,
        },
        riskDistribution: {
          low: 35,
          medium: 40,
          high: 20,
          veryHigh: 5,
        },
        statistics: {
          totalReports: 0,
          totalParticipatoryFeatures: 0,
        },
      });
    }
  });
}
