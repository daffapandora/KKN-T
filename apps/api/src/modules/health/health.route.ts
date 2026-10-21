import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { checkDatabaseConnection } from '../../plugins/db';
import { config } from '../../config';

export async function healthRoutes(fastify: FastifyInstance) {
  const handler = async (request: FastifyRequest, reply: FastifyReply) => {
    const dbStatus = await checkDatabaseConnection();
    const isHealthy = dbStatus.ok;

    if (!isHealthy) {
      request.log.error({ dbError: dbStatus.error }, 'Health check: database connection degraded');
    }

    const responsePayload = {
      status: isHealthy ? 'ok' : 'degraded',
      db: isHealthy,
      version: config.APP_VERSION,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };

    return reply.status(isHealthy ? 200 : 503).send(responsePayload);
  };

  // Support both /health and /api/v1/health
  fastify.get('/health', handler);
  fastify.get('/api/v1/health', handler);
}
