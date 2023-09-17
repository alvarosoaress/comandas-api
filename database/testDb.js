/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const mysql = require('mysql2/promise');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const { existsSync } = require('fs');

require('dotenv').config({
  path: path.resolve(process.cwd(), '.test.env'),
});

exports.createTestDatabase = async function (dbName) {
  const con = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });

  try {
    await con.connect();

    await con.execute(`CREATE DATABASE ${dbName}`);

    try {
      if (!existsSync(`${process.cwd()}/database/migrations/`)) {
        const { stdout, stderr } = await exec(
          `drizzle-kit generate:mysql --config=./drizzle.config.ts && ts-node-dev database/migrate.ts`,
        );

        console.log('Migration completed:', stdout);
      } else {
        const { stdout, stderr } = await exec(
          `ts-node-dev database/migrate.ts`,
        );
        console.log('Migration completed:', stdout);
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }

    await con.end();

    console.log(`\x1b[33m Test database ${dbName} created \x1b[0m`);
  } catch (error) {
    console.log('Error in create DB ', error);
  }
};

exports.dropTestDatabase = async function (dbName) {
  const con = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });

  try {
    await con.connect();

    await con.execute(`DROP DATABASE ${dbName}`);

    console.log(`\x1b[32m Test database ${dbName} dropped \x1b[0m`);

    await con.end();
  } catch (error) {
    console.log('Error in drop DB ', error);
  }
};
