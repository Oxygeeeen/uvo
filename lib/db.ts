import { Pool } from 'pg';

const globalForDatabase = globalThis as unknown as { oilValuePool?: Pool };

const rawConnectionString =
  process.env.DATABASE_URL ??
  'postgresql://unconfigured:unconfigured@127.0.0.1:5432/oil_value';

function normalizeConnectionString(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return value;
  }
  const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname);
  if (isLocal) return value;

  const sslMode = url.searchParams.get('sslmode');
  if (!sslMode || ['prefer', 'require', 'verify-ca'].includes(sslMode)) {
    url.searchParams.set('sslmode', 'verify-full');
  }
  return url.toString();
}

const connectionString = normalizeConnectionString(rawConnectionString);

export const db =
  globalForDatabase.oilValuePool ??
  new Pool({
    connectionString,
    max: 5,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDatabase.oilValuePool = db;
}

export function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }
}
