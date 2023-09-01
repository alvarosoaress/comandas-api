import type { Config } from 'drizzle-kit';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('./.env') });

export default {
  schema: './database/schema.ts',
  out: './database/migrations',
  driver: 'mysql2',
} satisfies Config;
