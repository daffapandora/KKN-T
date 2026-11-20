import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().optional(),
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_DB: z.string().default('kemitir_gis'),
  POSTGRES_USER: z.string().default('kemitir_user'),
  POSTGRES_PASSWORD: z.string().default('kemitir_secure_password_dev_2026'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').default('super_secret_jwt_dev_key_at_least_32_characters_long_kemitir_2026'),
  COOKIE_SECRET: z.string().min(32).default('cookie_secret_dev_key_kemitir_32_characters_long'),
  PHONE_PEPPER: z.string().default('kemitir_phone_pepper_salt_2026_sumowono'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  TURNSTILE_ENABLED: z.coerce.boolean().default(false),
  CLOUDFLARE_TURNSTILE_SITE_KEY: z.string().default('1x00000000000000000000AA'),
  CLOUDFLARE_TURNSTILE_SECRET_KEY: z.string().default('1x0000000000000000000000000000000AA'),
  BOT_PROTECTION_ENABLED: z.coerce.boolean().default(true),
  APP_VERSION: z.string().default('1.0.0'),
}).refine(
  (data) => {
    if (data.NODE_ENV === 'production') {
      const origins = data.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (origins.includes('*') || origins.length === 0 || origins[0] === '') {
        return false;
      }
      // Production credentials must never use default dev fallback values
      if (data.JWT_SECRET.includes('dev_key') || data.COOKIE_SECRET.includes('dev_key')) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'CORS_ORIGIN cannot be wildcard "*" and default dev secrets cannot be used in production mode',
    path: ['CORS_ORIGIN'],
  }
);

export const config = ConfigSchema.parse(process.env);

export function getAllowedCorsOrigins(): string[] | boolean {
  if (config.CORS_ORIGIN === '*') {
    return true;
  }
  return config.CORS_ORIGIN.split(',').map((origin) => origin.trim());
}

export function getDatabaseConnectionString(): string {
  if (config.DATABASE_URL) return config.DATABASE_URL;
  return `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`;
}
