const createUser = `INSERT INTO users(firstName, lastName, email, password, phone, address)
VALUES($1,$2,$3,$4,$5,$6) RETURNING id, firstname, lastname, email, phone, address, isadmin`;

const queryByEmail = 'SELECT * FROM users WHERE email = $1';

const queryById = 'SELECT * FROM users WHERE id=$1';

const updatePassword = 'UPDATE users SET password=$1 WHERE id=$2 RETURNING *';


export {
  createUser,
  queryByEmail,
  queryById,
  updatePassword,
};
