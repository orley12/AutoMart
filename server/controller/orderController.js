/* eslint-disable max-len */
import orderUtils from '../util/orderUtils';
import ApiError from '../error/ApiError';
import orderRepository from '../repository/orderRepository';
import carRepository from '../repository/carRepository';

export default class CarController {
  static createOrder(req, res, next) {
    const buyer = JSON.parse(req.decoded.id);
    const car = carRepository.findById(Number(req.body.carId));
    const errors = orderUtils.validatePropsOrder(req.body);
    try {
      if (errors.length > 0) {
        throw new ApiError(400, 'Bad Request', errors);
      } else if (!car) {
        throw new ApiError(404, 'Not found', ['Car cannot be found']);
      }
      const order = orderRepository.save(Number(buyer), req.body, car.price);
      res.status(200).json({
        status: 200,
        data: {
          id: order.id,
          carId: order.carId,
          createdOn: order.createdOn,
          status: order.status,
          sellersPrice: order.sellersPrice,
          offeredPrice: order.offeredPrice,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
