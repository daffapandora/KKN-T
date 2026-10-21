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

async function runSeeds() {
  console.log('[DB] Running seed data against:', connectionString.replace(/:[^:]*@/, ':****@'));
  const client = new Client({ connectionString });

  try {
    await client.connect();

    const seedsDir = path.resolve(__dirname, 'seeds');
    const files = fs
      .readdirSync(seedsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log(`[DB] Found ${files.length} seed file(s).`);

    for (const file of files) {
      console.log(`[DB] Executing seed: ${file}...`);
      const sqlContent = fs.readFileSync(path.join(seedsDir, file), 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sqlContent);
        await client.query('COMMIT');
        console.log(`[DB] Successfully seeded: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[DB] Failed to execute seed: ${file}`);
        throw err;
      }
    }

    console.log('[DB] Seeding completed successfully.');
  } catch (error) {
    console.error('[DB] Seeding error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeeds();
