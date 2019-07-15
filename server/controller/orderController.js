/* eslint-disable max-len */
/* eslint-disable camelcase */
import ApiError from '../error/ApiError';
import OrderRepository from '../repository/orderRepository';
import CarRepository from '../repository/carRepository';
import ErrorDetail from '../error/ErrorDetail';

export default class CarController {
  static async createOrder(req, res, next) {
    try {
      const buyerId = JSON.parse(req.decoded.id);
      const { rows } = await CarRepository.findById(Number(req.body.car_id));
      if (rows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('Params', 'carId', 'Car is not in our database', req.body.car_id)]);
      }
      const { rows: order } = await OrderRepository.save(Number(buyerId), req.body, rows[0].price);
      if (order.length < 1) {
        throw new ApiError(500, 'Internal Server Error',
          [new ErrorDetail('save', 'order data', 'no return value from save operation', req.body)]);
      }


      const {
        id, created_on, amount: price_offered, status, original_price: price, buyer, car_id,
      } = order[0];

      res.status(201).json({
        status: 201,
        data: {
          id,
          created_on,
          buyer,
          car_id,
          status,
          price,
          price_offered,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updatePrice(req, res, next) {
    const { rows } = await OrderRepository.findById(Number(req.params.id));
    try {
      if (rows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('Params', 'orderId', 'Order is not in our database', req.params.id)]);
      }
      const old_price_offered = rows[0].amount;

      if (rows[0].status === 'accepted') {
        throw new ApiError(400, 'Bad Request',
          [new ErrorDetail('Params', 'orderId', 'Order as already been accepted', req.params.id)]);
      }

      const { rows: updatedRows } = await OrderRepository.updatePrice(req.body.price, Number(req.params.id));
      if (updatedRows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('Params', 'orderId', 'Order is not in our database', req.params.id)]);
      }

      const {
        id, created_on, amount: new_price_offered, status, buyer, car_id,
      } = updatedRows[0];
      res.status(200).json({
        status: 200,
        data: {
          id,
          created_on,
          status,
          buyer,
          car_id,
          new_price_offered,
          old_price_offered,
        },
      });
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async getByOwner(req, res, next) {
    const ownerId = JSON.parse(req.decoded.id);
    try {
      const { rows } = await OrderRepository.findByOwner(Number(ownerId));
      if (rows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('header', 'ownerId', 'user as ordered nothing yet', ownerId)]);
      }

      res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async getOrder(req, res, next) {
    console.log('I got here');
    try {
      const { rows } = await OrderRepository.findById(Number(req.params.id));
      if (rows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('param', 'order id', 'order not found', req.params.id)]);
      }

      res.status(200).json({
        status: 200,
        data: {
          ...rows[0],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    const { status } = req.body;
    try {
      if (status.toLowerCase() !== 'accepted' && status.toLowerCase() !== 'rejected') {
        throw new ApiError(400, 'Bad Request',
          [new ErrorDetail('body', 'status', 'invalid status', status)]);
      }

      const { rows } = await OrderRepository.updateStatus(status.toLowerCase(), Number(req.params.id));
      if (rows.length < 1) {
        throw new ApiError(500, 'Internal Server Error',
          [new ErrorDetail('updateStatus', 'order id', 'no return value from update operation', req.params.id)]);
      }

      const updatedCar = rows[0];
      res.json({
        status: 200,
        message: 'Order Updated',
        data: {
          ...updatedCar,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
