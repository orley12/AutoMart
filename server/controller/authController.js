/* eslint-disable camelcase */
import dotenv from 'dotenv';

import AuthUtil from '../util/authUtil';
import ApiError from '../error/ApiError';
import AuthRepository from '../repository/authRepository';
import EmailUtil from '../util/emailUtil';
import MessageUtil from '../util/messageUtil';
import ErrorDetail from '../error/ErrorDetail';

dotenv.config();

/**
 * @class AuthController
 * @description Contains methods for each authentication related endpoint
 * @exports AuthController
 */
export default class AuthController {
  /**
   * @method signUp
   * @description creates a user account
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async signUp(req, res, next) {
    const {
      firstName, lastName, email, address, password, phone,
    } = req.body;

    try {
      const hashedPassword = await AuthUtil.hashPassWord(password);

      const userData = [firstName, lastName, email, hashedPassword, phone, address];
      const result = await AuthRepository.save(userData);
      if (result.rows[0]) {
        const user = result.rows[0];

        const token = AuthUtil.generateToken({ id: user.id });

        res.status(201).json({
          status: 201,
          message: `${user.first_name} ${user.last_name} Created`,
          data: {
            token,
            ...user,
          },
        });
      } else {
        throw new ApiError(500, 'Internal Server Error', [new ErrorDetail('save', 'user data', 'no return value from save operation', req.body)]);
      }
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        next(new ApiError(409, 'Resource Conflict', [new ErrorDetail('body', 'user data', 'User already exist', req.body)]));
      }
      next(error);
    }
  }

  /**
   * @method signIn
   * @description signs in an existing user account
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async signIn(req, res, next) {
    const { email: userEmail, password } = req.body;

    try {
      const user = await AuthUtil.authenticate(userEmail, password);

      const {
        id, first_name, last_name, email, phone, address, is_admin,
      } = user;

      const token = await AuthUtil.generateToken({ id });

      res.status(200).json({
        status: 200,
        message: `Welcome ${first_name} ${last_name}`,
        data: {
          id, token, first_name, last_name, email, phone, address, is_admin,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const { rows } = await AuthRepository.findAll();
      if (rows.length < 1) {
        throw new ApiError(404, 'Not found',
          [new ErrorDetail('null', 'query', 'No user are in the database yet', null)]);
      }

      res.status(200).json({
        status: 200,
        message: 'success',
        data: rows,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { rows } = await AuthRepository.delete(req.decoded.id);
      res.status(200).json({
        status: 200,
        message: 'Request Successful',
        data: 'Car Ad successfully deleted',
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      if (req.body.status !== true && req.body.status !== false) {
        throw new ApiError(400, 'Bad Request',
          [new ErrorDetail('body', 'status', 'invalid status', req.body.status)]);
      }

      const { rows } = await AuthRepository.updateStatus(req.params.id, req.body.status);
      if (rows.length < 1) {
        throw new ApiError(500, 'Internal Server Error',
          [new ErrorDetail('updateStatus', 'user id', 'no return value from update operation', req.params.id)]);
      }

      res.status(200).json({
        status: 200,
        message: 'success',
        data: {
          ...rows[0],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method resetPassword
   * @description depending on the form of request,
   *  it will reset the users password, send a password reset token
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async resetPassword(req, res, next) {
    try {
      if (req.resetPath === 1) {
        const { password, confirmPassword } = req.body;
        AuthUtil.passwordMatch(password, confirmPassword);

        const user = await AuthUtil.authenticate(req.params.email, req.query.token);

        const hashedPassword = await AuthUtil.hashPassWord(password);

        AuthRepository.updatePassword(user.id, hashedPassword);
        const details = MessageUtil.resetSuccess(user);
        EmailUtil.sendMailMethod(details);
        res.status(200).json({
          status: 200,
          message: 'Success',
          data: {
            message: 'Password reset successful',
          },
        });
      } else if (req.resetPath === 2) {
        const { password, newPassword } = req.body;

        const user = await AuthUtil.authenticate(req.params.email, password);

        const hashedPassword = await AuthUtil.hashPassWord(newPassword);

        AuthRepository.updatePassword(user.id, hashedPassword);
        const details = MessageUtil.resetSuccess(user);
        EmailUtil.sendMailMethod(details);
        res.status(200).json({
          status: 200,
          message: 'Success',
          data: {
            message: 'Password reset successful',
          },
        });
      } else if (req.resetPath === 0) {
        const { rows } = await AuthRepository.findByEmail(req.params.email);
        if (rows.length < 1) {
          throw new ApiError(404, 'Not user found', [new ErrorDetail('body', 'email', 'User not found', req.params.email)]);
        }
        const user = rows[0];

        const token = AuthUtil.generateToken({ id: user.id, password: user.password });
        const hashedPassword = await AuthUtil.hashPassWord(token);

        const { rows: updatedUser } = await AuthRepository.updatePassword(user.id, hashedPassword);
        const details = MessageUtil.resetPassword(updatedUser, token);
        EmailUtil.sendMailMethod(details);

        res.status(200).json({
          status: 204,
          message: 'No content',
          data: {
            token,
            message: 'Password reset mail as been sent to you',
          },
        });
      } else {
        throw new ApiError(400, 'Bad request', [
          new ErrorDetail('updatePassword', 'reset data', 'Request not properly formatted',
            ['token & password & confirmPassword',
              'no token & password & newPassword',
              'no token & no password & no newPassword, no confirmPassword']),
        ]);
      }
    } catch (error) {
      next(error);
    }
  }
}
