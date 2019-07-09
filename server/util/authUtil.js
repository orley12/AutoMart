import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthRepository from '../repository/authRepository';
import ApiError from '../error/ApiError';
import ErrorDetail from '../error/ErrorDetail';

export default class AuthUtil {
  static hashPassWord(password) {
    try {
      return bcrypt.hashSync(password, 10);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error', [new ErrorDetail('Body', 'password', 'Unable to hash password', password)]);
    }
  }

  static generateToken(payload) {
    try {
      return jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' });
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('generateToken', 'payload', 'Unable to generate token', payload)]);
    }
  }

  static comparePassword(password, hashedPassword) {
    try {
      return bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('comparePassword', 'password', 'Unable to compare password', password)]);
    }
  }

  // static async authenticate(email, password, callback) {
  //   const emailQuery = await authRepository.findByEmail(email);
  //   if (emailQuery.rows.length < 1) {
  //     return callback(new ApiError(401, 'Unauthorized',
  //       [new ErrorDetail('body', 'email', 'Wrong email provided', email)]));
  //   }
  //   bcrypt.compare(password, emailQuery.rows[0].password, (error, result) => {
  //     if (result === false) {
  //       return callback(new ApiError(401, 'Unauthorized',
  //         [new ErrorDetail('body', 'password', 'Wrong password provided', password)]));
  //     }
  //     if (result === true) {
  //       return callback(null, emailQuery.rows[0]);
  //     }
  //     return callback();
  //   });
  //   return null;
  // }

  static async authenticate(email, password) {
    try {
      const { rows } = await AuthRepository.findByEmail(email);
      if (rows.length < 1) {
        throw new ApiError(404, 'Not user found', [new ErrorDetail('body', 'email', 'User not found', email)]);
      }

      const validPassword = await this.comparePassword(password, rows[0].password);
      if (!validPassword) {
        throw new ApiError(400, 'Bad request', [new ErrorDetail('body', 'password', 'invalid password', password)]);
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static passwordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new ApiError(400, 'Bad Request', [new ErrorDetail('body', 'password', 'Passwords don\'t match', { password, confirmPassword })]);
    }
  }
}
