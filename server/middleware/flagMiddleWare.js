import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApiError from '../error/ApiError';
import ErrorDetail from '../error/ErrorDetail';

dotenv.config();

export default class CarMiddleware {
  static validateFlagProps(req, res, next) {
    req
      .checkBody('reason')
      .notEmpty()
      .withMessage('Reason field is required')
      .isLength({ min: 6, max: 50 })
      .withMessage('Reason should be between 6 to 50 characters');

    req
      .checkBody('description')
      .notEmpty()
      .withMessage('Description field is required')
      .isLength({ min: 10, max: 200 })
      .withMessage('Description should be between 10 to 200 characters');

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
        throw new ApiError(400, 'Bad Request',
          [new ErrorDetail('headers', 'x-access-token', 'No token was provided', null)]);
      }
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
        try {
          if (error) {
            throw new ApiError(401, 'Unauthorized',
              [new ErrorDetail('headers', 'x-access-token', 'Failed to authenticate token', token)]);
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
}
