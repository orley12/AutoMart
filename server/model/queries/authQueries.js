const createUser = `INSERT INTO users(first_name, last_name, email, password, phone, address)
VALUES($1,$2,$3,$4,$5,$6) RETURNING id, first_name, last_name, email, phone, address`;

const queryAll = 'SELECT id, first_name, last_name, email, phone, address, is_admin FROM users';

const queryByEmail = 'SELECT * FROM users WHERE email = $1';

const queryById = 'SELECT * FROM users WHERE id=$1';

const deleteUser = 'DELETE FROM users WHERE id=$1';

const updateStatus = 'UPDATE users SET is_admin=$1 WHERE id=$2 RETURNING id, first_name, last_name, email, phone, address, is_admin ';

const updatePassword = 'UPDATE users SET password=$1 WHERE id=$2 RETURNING *';


export {
  createUser,
  queryAll,
  queryByEmail,
  queryById,
  updatePassword,
  updateStatus,
  deleteUser,
};
