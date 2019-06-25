import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import authUtils from '../util/authUtil';
import ApiError from '../error/ApiError';
import authRepository from '../repository/authRepository';
import emailUtil from '../util/emailUtil';
import messageUtil from '../util/messageUtil';

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
      console.log('kkdkfk');
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

  static async resetPassword(req, res, next) {
    if ((req.query.token
       && req.body.password
       && req.body.confirmPassword)) {
      try {
        authUtils.validateSignUpPasswords(req.body.password, req.body.confirmPassword);
        authUtils.authenticate(req.params.email, req.query.token, (error, user) => {
          if (error || !user) {
            next(error);
          } else {
            const hashedPassword = authUtils.hashPassWord(req.body.password);
            // console.log(hashedPassword);
            const updatedResult = authRepository.updatePassword(user.id, hashedPassword);
            updatedResult.then((result) => {
              const details = messageUtil.resetSuccess(result.rows[0]);
              emailUtil.sendMailMethod(details);
              res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                  message: 'Password reset successful',
                },
              });
            }).catch(() => {
              next(new ApiError(417, 'Expectation failed', ['Password could not be updated try again']));
            });
          }
        });
      } catch (error) {
        next(error);
      }
    } else if ((req.body.password && req.body.newPassword)) {
      authUtils.authenticate(req.params.email, req.body.password, (error, user) => {
        if (error || !user) {
          next(error);
        } else {
          const hashedPassword = authUtils.hashPassWord(req.body.newPassword);
          const updatedResult = authRepository.updatePassword(user.id, hashedPassword);
          updatedResult.then((result) => {
            const details = messageUtil.resetSuccess(result.rows[0]);
            emailUtil.sendMailMethod(details);
            res.status(200).json({
              status: 200,
              message: 'Success',
              data: {
                message: 'Password reset successful',
              },
            });
          }).catch(() => {
            next(new ApiError(417, 'Expectation failed', ['Password could not be updated try again']));
          });
        }
      });
    } else {
      const emailQuery = await authRepository.findByEmail(req.params.email);
      if (emailQuery.rows.length > 0) {
        const user = emailQuery.rows[0];
        const token = jwt.sign({ id: user.id, password: user.password }, process.env.SECRET, { expiresIn: '24h' });
        const hashedPassword = await authUtils.hashPassWord(token);
        const updatedResult = authRepository.updatePassword(user.id, hashedPassword);
        updatedResult.then((result) => {
          const details = messageUtil.resetPassword(result.rows[0], token);
          emailUtil.sendMailMethod(details);
          res.status(204).json({
            status: 204,
            message: 'Success',
            data: {
              message: 'Password reset successful',
            },
          });
        }).catch((e) => {
          console.log(e);
          next(new ApiError(417, 'Expectation failed', ['Password could not be updated try again']));
        });
      } else {
        next(new ApiError(404, 'Not Found', ['User not found']));
      }
    }
  }
}
