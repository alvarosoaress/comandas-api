import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('./.env') });

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { schema, mode: 'default' });
