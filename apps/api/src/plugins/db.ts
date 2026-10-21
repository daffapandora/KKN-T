import { Pool } from 'pg';
import { getDatabaseConnectionString } from '../config';

export const db = new Pool({
  connectionString: getDatabaseConnectionString(),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function checkDatabaseConnection(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await db.query('SELECT 1 AS connected, PostGIS_Full_Version() AS postgis_version');
    return {
      ok: true,
      latencyMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: error?.message || 'Database connection error',
    };
  }
}
