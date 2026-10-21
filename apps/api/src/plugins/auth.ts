import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { config } from '../config';
import { UserRole } from '@kemitir/shared';

export interface JwtPayload {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  rt?: string | null;
  rw?: string | null;
  dusun?: string | null;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    optionalAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (...allowedRoles: UserRole[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  // Register cookies
  await fastify.register(fastifyCookie, {
    secret: config.COOKIE_SECRET,
    hook: 'onRequest',
  });

  // Register JWT
  await fastify.register(fastifyJwt, {
    secret: config.JWT_SECRET,
    cookie: {
      cookieName: 'access_token',
      signed: false,
    },
  });

  // Decorator: Mandatory authentication
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Sesi masuk tidak valid atau telah berakhir. Silakan masuk kembali.',
          requestId: request.id,
        },
      });
    }
  });

  // Decorator: Optional authentication (attaches request.user if valid token present)
  fastify.decorate('optionalAuthenticate', async (request: FastifyRequest, _reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      // Ignored for optional auth; request.user remains undefined
    }
  });

  // Decorator: Role-based access control
  fastify.decorate(
    'requireRole',
    (...allowedRoles: UserRole[]) =>
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Autentikasi diperlukan untuk mengakses data ini.',
              requestId: request.id,
            },
          });
        }

        const user = request.user as JwtPayload;
        if (!user || !allowedRoles.includes(user.role)) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: 'Anda tidak memiliki hak akses (role tidak mencukupi) untuk operasi ini.',
              requestId: request.id,
            },
          });
        }
      }
  );
}

export const registerAuthPlugin = fp(authPlugin);
