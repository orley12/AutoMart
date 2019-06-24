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

//   static updateOrder(req, res, next) {
//     const errors = orderUtils.validatePropsUpdateOrder(req.body);
//     try {
//       if (errors.length > 0) {
//         throw new ApiError(400, 'Bad Request', errors);
//       }
//       const order = orderRepository.findById(Number(req.params.id));
//       const oldPrice = order.offeredPrice;
//       order.offeredPrice = req.body.offeredPrice;
//       order.oldPrice = oldPrice;
//       const updatedOrder = orderRepository.update(order);
//       res.status(200).json({
//         status: 200,
//         data: {
//           id: updatedOrder.id,
//           carId: updatedOrder.carId,
//           status: updatedOrder.status,
//           oldOfferedPrice: updatedOrder.oldPrice,
//           newOfferedPrice: updatedOrder.offeredPrice,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
}
