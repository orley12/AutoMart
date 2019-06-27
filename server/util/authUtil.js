import bcrypt from 'bcrypt';
import { body } from 'express-validator/check';
import authRepository from '../repository/authRepository';
import ApiError from '../error/ApiError';
import ErrorDetail from '../error/ErrorDetail';

export default class AuthUtil {
  static hashPassWord(password) {
    return bcrypt.hashSync(password, 10);
  }

  static async authenticate(email, password, callback) {
    const emailQuery = await authRepository.findByEmail(email);
    if (emailQuery.rows.length < 1) {
      return callback(new ApiError(401, 'Unauthorized',
        [new ErrorDetail('body', 'email', 'Wrong email provided', email)]));
    }
    bcrypt.compare(password, emailQuery.rows[0].password, (error, result) => {
      if (result === false) {
        return callback(new ApiError(401, 'Unauthorized',
          [new ErrorDetail('body', 'password', 'Wrong password provided', password)]));
      }
      if (result === true) {
        return callback(null, emailQuery.rows[0]);
      }
      return callback();
    });
    return null;
  }

  static passwordMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new ApiError(400, 'Bad Request', [new ErrorDetail('body', 'password', 'Passwords don\'t match', { password, confirmPassword })]);
    }
  }
}
