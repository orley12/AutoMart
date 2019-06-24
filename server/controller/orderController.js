/* eslint-disable no-unused-vars */
import orderUtils from '../util/orderUtils';
import ApiError from '../error/ApiError';
import orderRepository from '../repository/orderRepository';
import carRepository from '../repository/carRepository';

export default class CarController {
  static createOrder(req, res, next) {
    const buyer = JSON.parse(req.decoded.id);
    try {
      orderUtils.validatePropsOrder(req.body);
      const carResult = carRepository.findById(Number(req.body.carId));
      carResult.then((car) => {
        const orderResult = orderRepository.save(Number(buyer), req.body);
        orderResult.then((order) => {
          const originalPrice = car.rows[0].price;
          res.status(201).json({
            status: 201,
            data: {
              ...order.rows[0],
              originalPrice,
            },
          });
        }).catch((error) => {
          next(new ApiError(417, 'Expectation failed', ['Order could not be made']));
        });
      }).catch((error) => {
        next(new ApiError(404, 'Not found', ['Car cannot be found']));
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrder(req, res, next) {
    try {
      orderUtils.validatePropsUpdateOrder(req.body);
      const orderResult = await orderRepository.findById(Number(req.params.id));
      const oldPrice = orderResult.rows[0].amount;
      if (orderResult.rows[0].status === 'pending') {
        const updatedOrder = await orderRepository.update(req.body.price, Number(req.params.id));
        const {
          id, createdon, amount: newPrice, status, buyer, carid,
        } = updatedOrder.rows[0];
        res.status(200).json({
          status: 200,
          data: {
            id,
            createdon,
            status,
            buyer,
            carid,
            newPrice,
            oldPrice,
          },
        });
      } else {
        next(new ApiError(400, 'Bad Request', ['Your order as already been accepted']));
      }
    } catch (error) {
      next(error);
    }
  }
}
