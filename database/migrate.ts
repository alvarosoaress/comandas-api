import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';

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
