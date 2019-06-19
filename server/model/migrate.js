/* eslint-disable no-unused-vars */
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
        firstName VARCHAR(50) NOT NULL,
        lastNAme VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        address VARCHAR(200) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE
    );`);

    const carTable = await db.query(`CREATE TABLE IF NOT EXISTS 
    cars(
        id SERIAL UNIQUE PRIMARY KEY,
        createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        state TEXT,
        status TEXT DEFAULT 'available',
        price NUMERIC NOT NULL,
        manufacturer VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        bodyType VARCHAR(50) NOT NULL,
        owner INTEGER REFERENCES users(id) ON DELETE CASCADE
    );`);

    const orderTable = await db.query(`CREATE TABLE IF NOT EXISTS 
    orders(
        id SERIAL UNIQUE PRIMARY KEY,
        createdOn DATE DEFAULT CURRENT_TIMESTAMP,
        amount NUMERIC NOT NULL,
        status TEXT DEFAULT 'pending',
        buyer INTEGER REFERENCES users(id) ON DELETE CASCADE,
        carId INTEGER REFERENCES cars(id)
    );`);

    const flagTable = await db.query(`CREATE TABLE IF NOT EXISTS 
    flags(
        id SERIAL UNIQUE PRIMARY KEY,
        createdOn DATE DEFAULT CURRENT_TIMESTAMP,
        reason TEXT NOT NULL,
        description TEXT NOT NULL,
        carId INTEGER REFERENCES cars(id) ON DELETE CASCADE
    );`);

    const values = ['admin', 'admin', 'admin@auto-mart.com', authUtil.hashPassWord('admin'), '75 Bode-Thomas, Surulere, Lagos', 'true'];
    const admin = await db.query('INSERT into users(firstName, lastName, email, password, address, isAdmin) VALUES($1,$2,$3,$4,$5,$6)', values);
  } catch (err) {
    console.log(err.stack);
    return err.stack;
  }
};

queryTable();
