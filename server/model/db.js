// eslint-disable-next-line no-unused-vars
import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// export default class AuthRepository {
//   static query(query) {
// pool.query(query, (err, res) => {
//   if (err) {
//     console.log(err.stack);
//   } else {
//     console.log(res.rows[0]);
//     // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
//   }
// });
// //   }
// // }

// const db = {
//   query: (text) => {
//     pool.query(text, (err, res) => {
//       if (err) {
//         console.log(err.stack);
//       } else {
//         console.log(res.rows[0]);
//       // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
//       }
//     });
//   },
// };

const db = {
  query: (text, params) => pool.query(text, params),
};
export default db;
