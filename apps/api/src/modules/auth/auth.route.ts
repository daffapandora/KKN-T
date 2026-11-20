import { FastifyInstance } from 'fastify';
import { RegisterCitizenSchema, LoginSchema, RefreshTokenSchema } from '@kemitir/shared';
import {
  registerCitizenUser,
  authenticateUser,
  createRefreshToken,
  rotateRefreshToken,
  getUserById,
} from './auth.service';
import { verifyTurnstileToken } from '../security/turnstile.service';

export async function authRoutes(fastify: FastifyInstance) {
  // 1. Citizen Registration with Invite Code & UU PDP Consent (Anti-bot rate limited)
  fastify.post(
    '/api/v1/auth/register',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '5 minutes',
        },
      },
    },
    async (request, reply) => {
      const parsed = RegisterCitizenSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Data pendaftaran warga tidak valid',
            details: parsed.error.errors.map((e) => ({
              field: e.path.join('.'),
              issue: e.message,
            })),
            requestId: request.id,
          },
        });
      }

      // Cloudflare Turnstile Human Verification
      const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, request.ip);
      if (!turnstile.success) {
        return reply.status(403).send({
          error: {
            code: 'BOT_VERIFICATION_FAILED',
            message: turnstile.error || 'Verifikasi bot Cloudflare gagal. Silakan coba kembali.',
            requestId: request.id,
          },
        });
      }

      const user = await registerCitizenUser(parsed.data);

    // Issue JWT access token (15 mins)
    const accessToken = fastify.jwt.sign({
      id: user.id,
      name: user.name,
      role: user.role,
      phone: parsed.data.phone,
      rt: user.rt,
      rw: user.rw,
      dusun: user.dusun,
    }, { expiresIn: '15m' });

    // Issue refresh token (7 days)
    const { token: refreshToken } = await createRefreshToken(user.id);

    // Set refresh token in httpOnly, Secure, SameSite=Lax cookie
    reply.setCookie('refresh_token', refreshToken, {
      path: '/api/v1/auth',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.status(201).send({
      message: 'Pendaftaran warga Desa Kemitir berhasil',
      data: {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          rt: user.rt,
          rw: user.rw,
          dusun: user.dusun,
          consentAt: user.consent_at,
        },
        accessToken,
      },
    });
  });

  // 2. Login (Constant-Time Verification & Anti-Brute Force Rate Limiting)
  fastify.post(
    '/api/v1/auth/login',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const parsed = LoginSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Nomor telepon dan kata sandi wajib diisi',
            details: parsed.error.errors.map((e) => ({
              field: e.path.join('.'),
              issue: e.message,
            })),
            requestId: request.id,
          },
        });
      }

      // Cloudflare Turnstile Human Verification (Defense against credential brute forcing)
      const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, request.ip);
      if (!turnstile.success) {
        return reply.status(403).send({
          error: {
            code: 'BOT_VERIFICATION_FAILED',
            message: turnstile.error || 'Verifikasi bot Cloudflare gagal. Silakan coba kembali.',
            requestId: request.id,
          },
        });
      }

      const user = await authenticateUser(parsed.data);

    const accessToken = fastify.jwt.sign({
      id: user.id,
      name: user.name,
      role: user.role,
      phone: parsed.data.phone,
      rt: user.rt,
      rw: user.rw,
      dusun: user.dusun,
    }, { expiresIn: '15m' });

    const { token: refreshToken } = await createRefreshToken(user.id);

    reply.setCookie('refresh_token', refreshToken, {
      path: '/api/v1/auth',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send({
      message: 'Berhasil masuk ke sistem',
      data: {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          rt: user.rt,
          rw: user.rw,
          dusun: user.dusun,
        },
        accessToken,
      },
    });
  });

  // 3. Refresh Token Rotation
  fastify.post('/api/v1/auth/refresh', async (request, reply) => {
    const cookieToken = (request.cookies as any)?.refresh_token;
    const bodyParsed = RefreshTokenSchema.safeParse(request.body || {});
    const token = cookieToken || bodyParsed.data?.refreshToken;

    if (!token) {
      return reply.status(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token penyegar (refresh token) tidak ditemukan',
          requestId: request.id,
        },
      });
    }

    const { userId, newRefreshToken } = await rotateRefreshToken(token);
    const user = await getUserById(userId);

    if (!user) {
      return reply.status(401).send({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Akun pengguna tidak ditemukan',
          requestId: request.id,
        },
      });
    }

    const newAccessToken = fastify.jwt.sign({
      id: user.id,
      name: user.name,
      role: user.role,
      phone: '',
      rt: user.rt,
      rw: user.rw,
      dusun: user.dusun,
    }, { expiresIn: '15m' });

    reply.setCookie('refresh_token', newRefreshToken, {
      path: '/api/v1/auth',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send({
      message: 'Token akses berhasil diperbarui',
      data: {
        accessToken: newAccessToken,
      },
    });
  });

  // 4. Logout (Clear cookies)
  fastify.post('/api/v1/auth/logout', async (_request, reply) => {
    reply.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return reply.send({ message: 'Berhasil keluar dari sesi' });
  });

  // 5. GET /api/v1/me (Current user inspection)
  fastify.get(
    '/api/v1/me',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const authUser = request.user;
      const user = await getUserById(authUser.id);

      if (!user) {
        return reply.status(404).send({
          error: {
            code: 'NOT_FOUND',
            message: 'Profil pengguna tidak ditemukan',
            requestId: request.id,
          },
        });
      }

      return reply.send({
        data: {
          id: user.id,
          name: user.name,
          role: user.role,
          rt: user.rt,
          rw: user.rw,
          dusun: user.dusun,
          status: user.status,
          consentAt: user.consent_at,
        },
      });
    }
  );
}
