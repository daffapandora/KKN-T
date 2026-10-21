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
  JWT_SECRET: z.string().default('super_secret_jwt_dev_key_at_least_32_characters_long_kemitir_2026'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

export const config = ConfigSchema.parse(process.env);

export function getDatabaseConnectionString(): string {
  if (config.DATABASE_URL) return config.DATABASE_URL;
  return `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`;
}
