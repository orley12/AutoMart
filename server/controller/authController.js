import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import authUtils from '../util/authUtil';
import ApiError from '../error/ApiError';
import authRepository from '../repository/authRepository';

dotenv.config();

export default class AuthController {
  static async signUp(req, res, next) {
    const {
      firstName, lastName, email, address, password, confirmPassword,
    } = req.body;

    try {
      authUtils.validatePropsSignUp(req.body);
      authUtils.validateSignUpPasswords(password, confirmPassword);

      const hashedPassword = await authUtils.hashPassWord(password);
      const userData = [firstName, lastName, email, hashedPassword, address];
      const result = await authRepository.save(userData);
      const user = result.rows[0];

      const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' });

      res.status(201).json({
        status: 201,
        message: `${user.firstName} ${user.lastName} Created`,
        data: {
          token,
          ...user,
        },
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        next(new ApiError(409, 'Resource Conflict', ['User already exist']));
      }
      next(error);
    }
  }

  // eslint-disable-next-line consistent-return
  static signIn(req, res, next) {
    try {
      authUtils.validatePropsSignIn(req.body);
      authUtils.authenticate(req.body.email, req.body.password, (error, user) => {
        try {
          if (error || !user) {
            throw new ApiError(401, 'Unauthorized', ['Wrong password or email']);
          }
          const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' });
          res.status(200).json({
            status: 200,
            message: `Welcome ${user.firstName} ${user.lastName}`,
            data: {
              token,
              id: user.id, // user id
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
          });
        } catch (err) {
          next(err);
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
