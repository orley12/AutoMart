import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import config from '../config/tokenConfig';

dotenv.config();

const loggedIn = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    console.log('CALLED');
    const err = new Error('No Token Provided');
    err.status = 400;
    next(err);
  } else {
    jwt.verify(token, process.env.SECRET || config.secret, (error, decoded) => {
      if (error) {
        const err = new Error('Failed to authencate token');
        err.status = 401;
        next(err);
      }
      req.decoded = decoded;
      next();
    });
  }
};

module.exports.loggedIn = loggedIn;
