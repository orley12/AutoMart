import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import AuthUtils from '../util/authUtil';
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
      const hashedPassword = await AuthUtils.hashPassWord(password);
      const userData = [firstName, lastName, email, hashedPassword, phone, address];

      const result = await AuthRepository.save(userData);
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

  /**
   * @method signIn
   * @description signs in an existing user account
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async signIn(req, res, next) {
    const {
      email: userEmail, password,
    } = req.body;
    try {
      AuthUtils.authenticate(userEmail, password, (error, user) => {
        if (error || !user) {
          next(error);
        } else {
          const {
            id, firstname: firstName, lastname: lastName, email, phone, address,
          } = user;

          const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' });

          res.status(200).json({
            status: 200,
            message: `Welcome ${firstName} ${lastName}`,
            data: {
              token,
              id,
              firstName,
              lastName,
              email,
              phone,
              address,
            },
          });
        }
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
    if (req.resetPath === 1) {
      const { password, confirmPassword } = req.body;
      try {
        AuthUtils.passwordMatch(password, confirmPassword);

        AuthUtils.authenticate(req.params.email, req.query.token, (error, user) => {
          if (error || !user) {
            next(error);
          } else {
            const hashedPassword = AuthUtils.hashPassWord(req.body.password);

            AuthRepository.updatePassword(user.id, hashedPassword)
              .then((result) => {
                const details = MessageUtil.resetSuccess(result.rows[0]);
                EmailUtil.sendMailMethod(details);
                res.status(200).json({
                  status: 200,
                  message: 'Success',
                  data: {
                    message: 'Password reset successful',
                  },
                });
              }).catch(() => {
                next(new ApiError(417, 'Expectation failed',
                  [new ErrorDetail('updatePassword', 'userId & password', 'Password could not be updated try again', `${user.id} & *******`)]));
              });
          }
        });
      } catch (error) {
        next(error);
      }
    } else if (req.resetPath === 2) {
      const { password, newPassword } = req.body;

      AuthUtils.authenticate(req.params.email, password, (error, user) => {
        if (error || !user) {
          next(error);
        } else {
          const hashedPassword = AuthUtils.hashPassWord(newPassword);

          AuthRepository.updatePassword(user.id, hashedPassword)
            .then((result) => {
              const details = MessageUtil.resetSuccess(result.rows[0]);
              EmailUtil.sendMailMethod(details);
              res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                  message: 'Password reset successful',
                },
              });
            }).catch(() => {
              next(new ApiError(417, 'Expectation failed',
                [new ErrorDetail('updatePassword', 'userId & password', 'Password could not be updated try again', `${user.id} & *******`)]));
            });
        }
      });
    } else {
      const emailQuery = await AuthRepository.findByEmail(req.params.email);
      if (emailQuery.rows.length > 0) {
        const user = emailQuery.rows[0];

        const token = jwt.sign({ id: user.id, password: user.password }, process.env.SECRET, { expiresIn: '24h' });
        const hashedPassword = await AuthUtils.hashPassWord(token);

        AuthRepository.updatePassword(user.id, hashedPassword)
          .then((data) => {
            if (process.env.NODE_ENV === 'test') {
              res.send(token);
            }
            const details = MessageUtil.resetPassword(data.rows[0], token);
            EmailUtil.sendMailMethod(details);

            res.status(204).json({
              status: 204,
              message: 'Success',
              data: {
                token,
                message: 'Password reset successful',
              },
            });
          }).catch(() => {
            next(new ApiError(417, 'Expectation failed',
              [new ErrorDetail('updatePassword', 'userId & password', 'Password could not be updated try again', `${user.id} & *******`)]));
          });
      } else {
        next(new ApiError(404, 'Not Found', ['User not found']));
      }
    }
  }
}
