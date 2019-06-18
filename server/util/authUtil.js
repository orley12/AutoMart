import bcrypt from 'bcrypt';
import authRepository from '../repository/authRepository';

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

    return errors;
  }

  static validatePropsSignIn(obj) {
    const props = ['email', 'password'];
    const errors = [];
    props.forEach((property) => {
      if (!obj[property] || obj[property].trim() === '') {
        errors.push(`${property} not provided`);
      }
    });

    return errors;
  }
}
