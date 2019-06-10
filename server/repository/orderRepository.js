/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
const orders = new Map();

export default class CarRepository {
  static save(buyer, order, originalPrice) {
    order.id = orders.size;
    order.buyer = buyer; // user id
    order.sellersPrice = originalPrice;
    order.status = 'pending';
    order.createdOn = Date.now();

    orders.set(order.id, order);

    return order;
  }

  static findById(id) {
    return orders.get(id);
  }

  static update(order) {
    orders.set(order.id, order);
    return orders.get(order.id);
  }
}
