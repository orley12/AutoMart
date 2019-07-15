/* eslint-disable no-unused-vars */
import '@babel/polyfill';
import db from './db';
import authUtil from '../util/authUtil';

// eslint-disable-next-line consistent-return
const queryTable = async () => {
  try {
    // Queries to drop Tables
    const dropUserTable = await db.query('DROP TABLE IF EXISTS users CASCADE;');
    const dropCarTable = await db.query('DROP TABLE IF EXISTS cars CASCADE;');
    const dropOrderTable = await db.query('DROP TABLE IF EXISTS orders CASCADE;');
    const dropFlagTable = await db.query('DROP TABLE IF EXISTS flags CASCADE;');

    // Queries to Create Tables
    const userTable = await db.query(`CREATE TABLE IF NOT EXISTS 
    users(
        id SERIAL UNIQUE PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        address VARCHAR(200) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE
    );`);

    const carTable = await db.query(`CREATE TABLE IF NOT EXISTS 
    cars(
        id SERIAL UNIQUE PRIMARY KEY,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        state TEXT,
        status TEXT DEFAULT 'available',
        price NUMERIC NOT NULL,
        manufacturer VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        body_type VARCHAR(50) NOT NULL,
        milage TEXT,
        transmission TEXT,
        year TEXT,
        exterior_img TEXT,
        interior_img TEXT,
        engine_img TEXT,
        img_url TEXT,
        location VARCHAR(200) DEFAULT 'no location',
        owner INTEGER REFERENCES users(id) ON DELETE CASCADE
    );`);

    const orderTable = await db.query(`CREATE TABLE IF NOT EXISTS 
    orders(
        id SERIAL UNIQUE PRIMARY KEY,
        created_on DATE DEFAULT CURRENT_TIMESTAMP,
        amount NUMERIC NOT NULL,
        status TEXT DEFAULT 'pending',
        original_price NUMERIC NOT NULL,
        buyer INTEGER REFERENCES users(id) ON DELETE CASCADE,
        car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE
    );`);

    const flagTable = await db.query(`CREATE TABLE IF NOT EXISTS 
    flags(
        id SERIAL UNIQUE PRIMARY KEY,
        created_on DATE DEFAULT CURRENT_TIMESTAMP,
        reason TEXT NOT NULL,
        description TEXT NOT NULL,
        car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );`);

  //   const queryAllUnsold = await db.query(`CREATE OR REPLACE FUNCTION queryAllUnsold(bodyType text DEFAULT NULL:: text,
  //     state text DEFAULT NULL:: text, manufacturer text DEFAULT NULL:: text,
  //     maxPice integer DEFAULT NULL:: integer, minPrice integer DEFAULT NULL:: integer)
  //     RETURNS cars
  //     LANGUAGE plpgsql
  //     AS $$
  //  BEGIN
  //  RETURN QUERY
  //  SELECT * FROM cars WHERE
  //  ($1 IS NULL OR bodyType = $1 )
  //  AND ($2 IS NULL OR state = $2 ) 
  //  AND ($3 IS NULL OR manufacturer = $3 )
  //  AND ($4 IS NULL OR price <= $4 ) 
  //  AND ($5 IS NULL OR price >= $5 );
  //  END;
  //  $$`);

    const values = ['admin', 'admin', 'admin@auto-mart.com', authUtil.hashPassWord('admin'), '090555345674', '75 Bode-Thomas, Surulere, Lagos', 'true'];
    const admin = await db.query('INSERT into users(first_name, last_name, email, password, phone, address, is_admin) VALUES($1,$2,$3,$4,$5,$6,$7)', values);
  } catch (err) {
    console.log(err.stack);
    return err.stack;
  }
};

queryTable();
