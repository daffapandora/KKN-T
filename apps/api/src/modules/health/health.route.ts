import { FastifyInstance } from 'fastify';
import { checkDatabaseConnection } from '../../plugins/db';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_request, reply) => {
    const dbStatus = await checkDatabaseConnection();
    const isHealthy = dbStatus.ok;

    const responsePayload = {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        connected: dbStatus.ok,
        latencyMs: dbStatus.latencyMs,
        ...(dbStatus.error ? { error: dbStatus.error } : {}),
      },
    };

    return reply.status(isHealthy ? 200 : 503).send(responsePayload);
  });
}
