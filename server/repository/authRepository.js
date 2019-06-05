/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import bcrypt from 'bcrypt';

const users = new Map();

export default class AuthRepository {
  static hashPassWord(password) {
    return bcrypt.hashSync(password, 10);
  }

  // eslint-disable-next-line class-methods-use-this
  static findByEmail(email) {
    let user = {};
    // eslint-disable-next-line no-unused-vars
    users.forEach((value) => {
      if (value.email.toLowerCase() === email.toLowerCase()) {
        user = value;
      }
    });
    return user;
  }

  static authenticate(email, password, callback) {
    const user = this.findByEmail(email);
    // console.log(user);
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

  static save(user, hashPassWord) {
    user.password = hashPassWord;
    user.id = users.size;
    user.is_admin = false;

    users.set(user.id, user);
    return user;
  }

  static findById(id) { return users.get(id); }
}
