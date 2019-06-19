import bcrypt from 'bcrypt';
import authRepository from '../repository/authRepository';
import ApiError from '../error/ApiError';

export default class AuthUtil {
  static hashPassWord(password) {
    return bcrypt.hashSync(password, 10);
  }

  // eslint-disable-next-line consistent-return
  static authenticate(email, password, callback) {
    const user = authRepository.findByEmail(email);
    if (!user) {
      return callback(new Error('user not found'));
    }
    bcrypt.compare(password, user.password, (error, result) => {
      if (result === true) {
        return callback(null, user);
      }
      return callback();
    });
  }

  static validatePropsSignUp(obj) {
    const props = ['email', 'firstName', 'lastName', 'phone', 'address', 'password', 'confirmPassword'];
    const errors = [];
    props.forEach((property) => {
      if (!obj[property] || obj[property].trim() === '') {
        errors.push(`${property} not provided`);
      }
    });
    if (errors.length > 0) {
      throw new ApiError(400, 'Bad Request', errors);
    }
  }

  static validateSignUpPasswords(password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new ApiError(400, 'Bad Request', ['Passwords don\'t match']);
    }
  }

  static validatePropsSignIn(obj) {
    const props = ['email', 'password'];
    const errors = [];
    props.forEach((property) => {
      if (!obj[property] || obj[property].trim() === '') {
        errors.push(`${property} not provided`);
      }
    });
    if (errors.length > 0) {
      throw new ApiError(400, 'Bad Request', errors);
    }
  }
}
