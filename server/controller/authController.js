import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import authUtils from '../util/authUtil';
import ApiError from '../error/ApiError';
import authRepository from '../repository/authRepository';

dotenv.config();

export default class AuthController {
  static async signUp(req, res, next) {
    const {
      firstName, lastName, email, address, password, confirmPassword, phone,
    } = req.body;

    try {
      authUtils.validatePropsSignUp(req.body);
      authUtils.validateSignUpPasswords(password, confirmPassword);

      const hashedPassword = await authUtils.hashPassWord(password);
      const userData = [firstName, lastName, email, hashedPassword, phone, address];

      const result = await authRepository.save(userData);
      const user = result.rows[0];

      const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' });

      res.status(201).json({
        status: 201,
        message: `${user.firstname} ${user.lastname} Created`,
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

  static async signIn(req, res, next) {
    const {
      email, password,
    } = req.body;
    try {
      console.log("kkdkfk");
      authUtils.validatePropsSignIn(req.body);
      authUtils.authenticate(email, password, (error, user) => {
        if (error || !user) {
          next(error);
        } else {
          const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' });
          res.status(200).json({
            status: 200,
            message: `Welcome ${user.firstName} ${user.lastName}`,
            data: {
              token,
              ...user,
            },
          });
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
