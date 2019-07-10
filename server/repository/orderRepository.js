import db from '../model/db';
import {
  createOrder,
  queryById,
  queryByOwner,
  queryByCarId,
  updateOrderPrice,
  updateOrderStatus,
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

  static findByOwner(owner) {
    try {
      return db.query(queryByOwner, [owner]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('findByOwner', 'order owner', 'Unable to find order by owner', owner)]);
    }
  }

  static findBycarId(carId) {
    try {
      return db.query(queryByCarId, [carId]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('findBycarId', 'order carId', 'Unable to find order by carId', carId)]);
    }
  }

  static updatePrice(price, id) {
    try {
      return db.query(updateOrderPrice, [price, 'pending', id]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('update', 'order id & price', 'Unable to update order', `${price} & ${id}`)]);
    }
  }

  static updateStatus(status, id) {
    try {
      return db.query(updateOrderStatus, [status, id]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('update', 'order id & price', 'Unable to update order', `${status} & ${id}`)]);
    }
  }
}
