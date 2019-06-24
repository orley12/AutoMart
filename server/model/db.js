// eslint-disable-next-line no-unused-vars
import { Pool, types } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool;
if (process.env.NODE_ENV === 'test') {
  pool = new Pool({ connectionString: process.env.TESTDB_URL });
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

types.setTypeParser(1700, val => parseFloat(val));

const db = {
  query: (text, params) => pool.query(text, params),
};
export default db;
