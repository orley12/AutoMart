import db from '../model/db';
import { queryByEmail, createUser, queryById } from '../model/queries/authQueries';

export default class authRepository {
  static findByEmail(email) {
    console.log(db.query(queryByEmail, [email]));
    return db.query(queryByEmail, [email]);
  }

  static save(user) {
    return db.query(createUser, user);
  }

  static findById(id) {
    return db.query(queryById, [id]);
  }
}
