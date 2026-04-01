import {Pool} from 'pg';

const globalForCommentsDb = globalThis as unknown as {
  commentsDbPool?: Pool;
};

function normalizeConnectionString(connectionString: string) {
  if (!connectionString.includes('sslmode=')) {
    return `${connectionString}${connectionString.includes('?') ? '&' : '?'}sslmode=no-verify`;
  }

  return connectionString.replace(/sslmode=require/g, 'sslmode=no-verify');
}

function createPool() {
  const rawConnectionString = process.env.DATABASE_URL;

  if (!rawConnectionString || rawConnectionString.includes('REPLACE_')) {
    return null;
  }

  const connectionString = normalizeConnectionString(rawConnectionString);

  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: 5,
    idleTimeoutMillis: 30_000
  });
}

export function getCommentsDb() {
  if (!globalForCommentsDb.commentsDbPool) {
    const pool = createPool();
    if (!pool) {
      return null;
    }
    globalForCommentsDb.commentsDbPool = pool;
  }

  return globalForCommentsDb.commentsDbPool;
}
