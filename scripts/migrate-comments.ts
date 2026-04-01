import {config} from 'dotenv';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {Client} from 'pg';

function normalizeConnectionString(connectionString: string) {
  if (!connectionString.includes('sslmode=')) {
    return `${connectionString}${connectionString.includes('?') ? '&' : '?'}sslmode=no-verify`;
  }

  return connectionString.replace(/sslmode=require/g, 'sslmode=no-verify');
}

async function run() {
  // Load .env variables
  config({path: resolve(process.cwd(), '.env')});

  const rawConnectionString =
    process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL;

  if (!rawConnectionString) {
    throw new Error('DATABASE_URL or DATABASE_URL_DIRECT is required');
  }

  const connectionString = normalizeConnectionString(rawConnectionString);

  const migrationPath = resolve(process.cwd(), 'db/migrations/001_create_blog_comments.sql');
  const sql = await readFile(migrationPath, 'utf8');

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Comments migration completed');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error('Comments migration failed:', error);
  process.exit(1);
});
