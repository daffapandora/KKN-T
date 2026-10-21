import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import { config } from './config';
import { errorHandler } from './plugins/errorHandler';
import { healthRoutes } from './modules/health/health.route';
import { dashboardRoutes } from './modules/dashboard/dashboard.route';
import { layersRoutes } from './modules/layers/layers.route';
import { waterSourcesRoutes } from './modules/water-sources/water-sources.route';
import { reportsRoutes } from './modules/reports/reports.route';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'test' ? 'silent' : 'info',
    },
    disableRequestLogging: config.NODE_ENV === 'test',
  });

  // Security headers & sensible helpers
  app.register(helmet, {
    contentSecurityPolicy: false, // Managed by Nginx in production
  });
  app.register(sensible);

  // CORS configuration
  app.register(cors, {
    origin: config.CORS_ORIGIN === '*' ? true : [config.CORS_ORIGIN],
    credentials: true,
  });

  // Rate Limiting (anti-spam)
  app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: '1 minute',
  });

  // Global standardized error handler
  app.setErrorHandler(errorHandler);

  // Register Routes
  app.register(healthRoutes);
  app.register(dashboardRoutes);
  app.register(layersRoutes);
  app.register(waterSourcesRoutes);
  app.register(reportsRoutes);

  return app;
}
