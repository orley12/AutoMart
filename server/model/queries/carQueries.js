const createCar = `INSERT INTO cars(state, price, manufacturer, model,
   bodyType, transmission, milage, year, exteriorImg, interiorImg, 
   engineImg, ownerEmail, owner)
VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`;

const queryAll = 'SELECT * FROM cars';

const queryAllUnsold = 'SELECT * FROM cars WHERE status = $1';

const updateCarStatus = 'UPDATE cars SET status=$1 WHERE id=$2 RETURNING *';

const updateCarPrice = 'UPDATE cars SET price=$1 WHERE id=$2 RETURNING *';

const queryById = 'SELECT * FROM cars WHERE id=$1';

export {
  createCar,
  queryAll,
  queryAllUnsold,
  updateCarStatus,
  queryById,
  updateCarPrice,
};
