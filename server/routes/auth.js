import express from 'express';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';
import User from '../repository/auth';

// eslint-disable-next-line import/extensions
import config from '../config/tokenConfig.js';
import authMiddleWare from '../middleware/auth';

dotenv.config();
const router = express.Router();

router.post('/signup', authMiddleWare.loggedIn, (req, res, next) => {
  if (req.body.email
        && req.body.name
        && req.body.phone
        && req.body.address
        && req.body.password
        && req.body.confirmPassword) {
    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error('Passwords do not match');
      err.status = 400;
      next(err);
    }
    const hashedPassword = User.hashPassword(req.body.password);
    const userData = {
      email: req.body.email,
      first_name: req.body.name,
      last_name: req.body.name,
      phone: req.body.phone,
      password: hashedPassword,
      address: req.body.address,
    };
    const user = User.save(userData);
    const token = jwt.sign({ id: user.id },
      process.env.SECRET || config.secret, { expiresIn: 86400 });
    res.json({
      status: 201,
      message: `${user.first_name} ${user.last_name} Created`,
      data: {
        token,
        id: user.id, // id of newly created user
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address: user.address,
      },
    });
  } else {
    const err = new Error('All fields are required');
    err.status = 400;
    next(err);
  }
});

module.exports = router;
