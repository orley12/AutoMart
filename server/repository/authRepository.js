import db from '../model/db';
import { queryByEmail, createUser } from '../model/queries/authQueries';

const users = new Map();

export default class authRepository {
  static findByEmail(email) {
    return db.query(queryByEmail, [email]);
  }

  static save(user) {
    return db.query(createUser, user);
  }

  static findById(id) { return users.get(id); }
}
