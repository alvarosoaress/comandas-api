const util = require('util');
const pgp = require('pg-promise')();
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const postgres = require('postgres');

require('dotenv').config({
  path: path.resolve(process.cwd(), '.test.env'),
});

const cn = {
  connectionString: process.env.DATABASE_URL_FIXED,
};
exports.createTestDatabase = async function (dbName) {
  const con = pgp(cn);

  try {
    await con.none(`CREATE DATABASE ${dbName}`);

    try {
      const { stdout, stderr } = await exec(
        `drizzle-kit generate:pg --config=./drizzle.config.ts && ts-node-dev database/migrate.ts`,
      );
      console.log('Migration completed:', stdout);
    } catch (error) {
      console.error('Migration failed:', error);
    }

    console.log(`\x1b[33m Test database ${dbName} created \x1b[0m`);
  } catch (error) {
    console.log('Error in create DB ', error);
  }
};

exports.dropTestDatabase = async function (dbName) {
  const con = pgp(cn);

  try {
    await con.none(`DROP DATABASE ${dbName}`);

    console.log(`\x1b[32m Test database ${dbName} dropped \x1b[0m`);
  } catch (error) {
    console.log('Error in drop DB ', error);
  }
};
