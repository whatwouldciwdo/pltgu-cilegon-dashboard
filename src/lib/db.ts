import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:password@localhost:5432/pltgu_vault';

export const pool: Pool =
  global.__pgPool ||
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  global.__pgPool = pool;
}
