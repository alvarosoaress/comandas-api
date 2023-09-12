import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import * as schema from './schema';
import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  multipleStatements: true,
});

const db = drizzle(connection, { schema, mode: 'default' });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
  console.log('Migration started...');
  // this will automatically run needed migrations on the database
  await migrate(db, { migrationsFolder: './database/migrations' });
  console.log('Migration ended.');

  process.exit(0);
}

main().catch((err) => {
  console.log(err);
  process.exit(0);
});
