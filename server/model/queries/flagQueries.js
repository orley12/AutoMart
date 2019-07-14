/* eslint-disable import/prefer-default-export */
const createFlag = `INSERT INTO flags(reason, description, user_id, car_id) 
VALUES($1,$2,$3,$4) RETURNING *`;

export {
  createFlag,
};
