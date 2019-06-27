import db from '../model/db';
import {
  createOrder,
  queryById,
  updateOrderPrice,
} from '../model/queries/orderQueries';

export default class OrderRepository {
  static async save(buyer, order) {
    const orderData = [order.price, buyer, order.carId];
    const result = await db.query(createOrder, orderData);
    return result;
  }

  static async findById(id) {
    const result = await db.query(queryById, [id]);
    return result;
  }

  static async update(price, id) {
    const result = await db.query(updateOrderPrice, [price, id]);
    return result;
  }
}
