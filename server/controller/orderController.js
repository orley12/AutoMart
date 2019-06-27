import ApiError from '../error/ApiError';
import OrderRepository from '../repository/orderRepository';
import CarRepository from '../repository/carRepository';
import ErrorDetail from '../error/ErrorDetail';

export default class CarController {
  static createOrder(req, res, next) {
    const buyer = JSON.parse(req.decoded.id);
    CarRepository.findById(Number(req.body.carId))
      .then((carData) => {
        const car = carData.rows[0];
        if (car) {
          OrderRepository.save(Number(buyer), req.body)
            .then((order) => {
              const originalPrice = car.price;
              res.status(201).json({
                status: 201,
                data: {
                  ...order.rows[0],
                  originalPrice,
                },
              });
            }).catch(() => {
              next(new ApiError(500, 'Internal Server Error', [new ErrorDetail('body', 'Order Properties', 'Unable to make order', req.body)]));
            });
        }
      }).catch(() => {
        next(new ApiError(404, 'Not Found', [new ErrorDetail('Params', 'carId', 'Car is not in our database', req.body.carId)]));
      });
  }

  static updateOrder(req, res, next) {
    OrderRepository.findById(Number(req.params.id))
      .then((order) => {
        const oldPrice = order.rows[0].amount;
        if (order.rows[0].status === 'pending') {
          OrderRepository.update(req.body.price, Number(req.params.id))
            .then((updatedOrder) => {
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
            });
        } else {
          next(new ApiError(400, 'Bad Request', [new ErrorDetail('Params', 'orderId', 'Order as already been accepted', req.params.id)]));
        }
      }).catch(() => {
        next(new ApiError(404, 'Not Found', [new ErrorDetail('Params', 'orderId', 'Order is not in our database', req.params.id)]));
      });
  }
}
