const createUser = `INSERT INTO users(firstName, lastName, email, password, address)
VALUES($1,$2,$3,$4,$5) RETURNING id, firstname, lastname, email, address, isadmin`;

const queryByEmail = 'SELECT * FROM users WHERE email=$1';

const verifyUser = "UPDATE users SET status='verified' WHERE email=$1";

const queryById = 'SELECT * FROM users WHERE userid = $1';

export {
  createUser,
  queryByEmail,
  verifyUser,
  queryById,
};
