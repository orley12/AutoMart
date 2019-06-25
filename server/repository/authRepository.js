import db from '../model/db';
import {
  queryByEmail, createUser, queryById, updatePassword,
} from '../model/queries/authQueries';

export default class authRepository {
  static findByEmail(email) {
    return db.query(queryByEmail, [email]);
  }

  static save(user) {
    return db.query(createUser, user);
  }

  static async findById(id) {
    const result = await db.query(queryById, [id]);
    return result;
  }

  static async updatePassword(id, password) {
    const result = await db.query(updatePassword, [password, id]);
    return result;
  }
}
