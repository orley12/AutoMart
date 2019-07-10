const createOrder = `INSERT INTO orders(amount, buyer, original_price, car_id)
 VALUES($1,$2,$3,$4) RETURNING *`;

const updateOrderPrice = 'UPDATE orders SET amount=$1 WHERE id=$2 RETURNING *';

const queryById = 'SELECT * FROM orders WHERE id=$1';

const queryByOwner = 'SELECT * FROM orders WHERE buyer=$1';

const queryByCarId = 'SELECT * FROM orders WHERE car_id=$1';


export {
  createOrder,
  updateOrderPrice,
  queryById,
  queryByOwner,
  queryByCarId,
};
