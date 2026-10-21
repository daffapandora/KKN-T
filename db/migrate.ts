import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER || 'kemitir_user'}:${
    process.env.POSTGRES_PASSWORD || 'kemitir_secure_password_dev_2026'
  }@${process.env.POSTGRES_HOST || 'localhost'}:${
    process.env.POSTGRES_PORT || '5432'
  }/${process.env.POSTGRES_DB || 'kemitir_gis'}`;

async function runMigrations() {
  console.log('[DB] Connecting to database for migration:', connectionString.replace(/:[^:]*@/, ':****@'));
  const client = new Client({ connectionString });

  try {
    await client.connect();

    // Ensure schema_migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const migrationsDir = path.resolve(__dirname, 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log(`[DB] Found ${files.length} migration file(s).`);

    for (const file of files) {
      const checkRes = await client.query(
        'SELECT version FROM schema_migrations WHERE version = $1',
        [file]
      );

      if (checkRes.rowCount && checkRes.rowCount > 0) {
        console.log(`[DB] Skipping already applied migration: ${file}`);
        continue;
      }

      console.log(`[DB] Applying migration: ${file}...`);
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sqlContent);
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`[DB] Successfully applied: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[DB] Failed to apply migration: ${file}`);
        throw err;
      }
    }

    console.log('[DB] All migrations applied successfully.');
  } catch (error) {
    console.error('[DB] Migration process encountered an error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
