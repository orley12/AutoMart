const createUser = `INSERT INTO users(firstName, lastName, email, password, address, isAdmin)
VALUES($1,$2,$3,$4,$5) RETURNING id, firstName, lastName, email, address, isAdmin`;

const queryByEmail = 'SELECT * FROM users WHERE email = $1';

const verifyUser = "UPDATE users SET status='verified' WHERE email=$1";

const getUserEmail = 'SELECT * FROM users WHERE email=$1';

export {
  createUser,
  queryByEmail,
  verifyUser,
  getUserEmail,
};
