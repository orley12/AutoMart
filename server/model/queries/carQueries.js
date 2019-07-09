const createCar = `INSERT INTO cars(state, price, manufacturer, model,
   body_type, transmission, milage, year, exterior_img, interior_img, 
   engine_img, location, owner)
VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`;

const queryAll = 'SELECT * FROM cars';

const queryAllUnsold = 'SELECT * FROM cars WHERE status = $1';

const updateCarStatus = 'UPDATE cars SET status=$1 WHERE id=$2 RETURNING *';

const updateCarPrice = 'UPDATE cars SET price=$1 WHERE id=$2 RETURNING *';

const queryById = 'SELECT * FROM cars WHERE id=$1';

const deletecar = 'DELETE FROM cars WHERE id=$1';

const createFlag = `INSERT INTO flags(reason, description, user_id, car_id) 
VALUES($1,$2,$3,$4) RETURNING *`;

export {
  createCar,
  queryAll,
  queryAllUnsold,
  updateCarStatus,
  queryById,
  updateCarPrice,
  deletecar,
  createFlag,
};
