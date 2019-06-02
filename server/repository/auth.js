/* eslint-disable no-param-reassign */
import bcrypt from 'bcrypt';

const User = {};
const users = new Map();

User.hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, 10);
  return hash;
};

const findByEmail = (email) => {
  let user = {};
  // eslint-disable-next-line no-unused-vars
  users.forEach((value, key) => {
    if (value.email.toLowerCase() === email.toLowerCase()) {
      user = value;
    }
  });
  return user;
};

// eslint-disable-next-line consistent-return
User.authenticate = (email, password, callback) => {
  const user = findByEmail(email);
  if (!user) {
    return callback(new Error('user not found'));
  }
  bcrypt.compare(password, user.password, (error, result) => {
    if (result === true) {
      return callback(null, user);
    }
    return callback();
  });
};

User.save = (user) => {
  user.id = users.size;
  user.is_admin = false;

  users.set(user.id, user);
  return user;
};

User.findById = id => users.get(id);

module.exports = User;
