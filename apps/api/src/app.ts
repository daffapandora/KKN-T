import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import { config, getAllowedCorsOrigins } from './config';
import { errorHandler } from './plugins/errorHandler';
import { registerAuthPlugin } from './plugins/auth';
import { registerBotProtectionPlugin } from './plugins/botProtection';
import { healthRoutes } from './modules/health/health.route';
import { authRoutes } from './modules/auth/auth.route';
import { dashboardRoutes } from './modules/dashboard/dashboard.route';
import { layersRoutes } from './modules/layers/layers.route';
import { waterSourcesRoutes } from './modules/water-sources/water-sources.route';
import { reportsRoutes } from './modules/reports/reports.route';
import { tilesRoutes } from './modules/tiles/tiles.route';
import { docsRoutes } from './modules/docs/docs.route';

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

  // CORS configuration (enforces allow-list, strictly disallows * in production)
  app.register(cors, {
    origin: getAllowedCorsOrigins(),
    credentials: true,
  });

  // Rate Limiting (anti-spam)
  app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: '1 minute',
  });

  // Global standardized error handler
  app.setErrorHandler(errorHandler);

  // Register Authentication & RBAC Plugin
  app.register(registerAuthPlugin);

  // Register Anti-Bot & Threat Protection Plugin
  app.register(registerBotProtectionPlugin);

  // Register Routes
  app.register(healthRoutes);
  app.register(authRoutes);
  app.register(dashboardRoutes);
  app.register(layersRoutes);
  app.register(waterSourcesRoutes);
  app.register(reportsRoutes);
  app.register(tilesRoutes);
  app.register(docsRoutes);

  return app;
}

