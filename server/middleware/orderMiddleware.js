import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApiError from '../error/ApiError';
import OrderRepository from '../repository/orderRepository';
import AuthRepository from '../repository/authRepository';
import ErrorDetail from '../error/ErrorDetail';

dotenv.config();

export default class OrderMiddleware {
  static validateOrderProps(req, res, next) {
    req
      .checkBody('carId')
      .notEmpty()
      .withMessage('CarId field is required')
      .isInt()
      .withMessage('CarId should be a number');

    req
      .checkBody('price')
      .notEmpty()
      .withMessage('Price field is required')
      .isInt()
      .withMessage('Price should be a number');

    const errors = req.validationErrors();
    if (errors) {
      next(new ApiError(400, 'Bad Request', errors));
    }
    next();
  }

  static validateUpdateOrderProps(req, res, next) {
    req
      .checkBody('price')
      .notEmpty()
      .withMessage('Price field is required')
      .isInt()
      .withMessage('Price should be a number');

    const errors = req.validationErrors();
    if (errors) {
      next(new ApiError(400, 'Bad Request', errors));
    }
    next();
  }

  static canWrite(req, res, next) {
    const token = req.headers['x-access-token'];
    try {
      if (!token) {
        throw new ApiError(400, 'Bad Request', [new ErrorDetail('headers', 'x-access-token', 'No token was provided', null)]);
      }
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
        try {
          if (error) {
            throw new ApiError(401, 'Unauthorized', [new ErrorDetail('headers', 'x-access-token', 'Failed to authenticate token', token)]);
          }
          req.decoded = decoded;
          next();
        } catch (err) {
          next(err);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async isOwner(req, res, next) {
    try {
      const userId = req.decoded.id;

      const { rows } = await OrderRepository.findById(Number(req.params.id));
      if (rows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('Params', 'orderId', 'order is not in our database', req.params.id)]);
      }

      if (userId !== rows[0].buyer) {
        throw new ApiError(401, 'Unauthorizied',
          [new ErrorDetail('Headers', 'userId', 'You do not have permission to perform this action', req.decoded.id)]);
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  }

  static async userExist(req, res, next) {
    try {
      const userId = JSON.parse(req.decoded.id);
      const { rows } = await AuthRepository.findById(Number(userId));
      if (rows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('Headers', 'x-access-token', 'User is not in our database', req.decoded.id)]);
      }
      req.userExist = true;
      next();
    } catch (error) {
      next(error);
    }
  }
}
