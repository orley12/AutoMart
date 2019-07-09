import db from '../model/db';
import {
  createOrder,
  queryById,
  updateOrderPrice,
} from '../model/queries/orderQueries';
import ApiError from '../error/ApiError';
import ErrorDetail from '../error/ErrorDetail';

export default class OrderRepository {
  static save(buyer, order, price) {
    const orderData = [order.price, buyer, price, order.carId];
    try {
      return db.query(createOrder, orderData);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('body', 'order Properties', 'Unable to save order', orderData)]);
    }
  }

  static findById(id) {
    try {
      return db.query(queryById, [id]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('findById', 'order id', 'Unable to find order by id', id)]);
    }
  }

  static update(price, id) {
    try {
      return db.query(updateOrderPrice, [price, id]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('update', 'order id & price', 'Unable to update order', `${price} & ${id}`)]);
    }
  }
}
