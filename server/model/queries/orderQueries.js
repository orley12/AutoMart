const createOrder = `INSERT INTO orders(amount, buyer, carId)
 VALUES($1,$2,$3) RETURNING *`;

const updateOrderPrice = 'UPDATE orders SET amount=$1 WHERE id=$2 RETURNING *';

const queryById = 'SELECT * FROM orders WHERE id=$1';

export {
  createOrder,
  updateOrderPrice,
  queryById,
};
