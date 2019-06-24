import db from '../model/db';
import {
  createOrder,
//   queryById,
//   updateOrderPrice,
} from '../model/queries/orderQueries';

export default class OrderRepository {
  static async save(buyer, order) {
    const orderData = [order.price, buyer, order.carId];
    const result = await db.query(createOrder, orderData);
    return result;
  }

//   static findById(id) {
//     return orders.get(id);
//   }

//   static update(order) {
//     orders.set(order.id, order);
//     return orders.get(order.id);
//   }
}
