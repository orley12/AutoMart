/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApiError from '../error/ApiError';
import carRepository from '../repository/carRepository';
import authRepository from '../repository/authRepository';
import { queryById } from '../model/queries/authQueries';
import ErrorDetail from '../error/ErrorDetail';

dotenv.config();

export default class CarMiddleware {
  static validateUpdateStatusProps(req, res, next) {
    req
      .checkBody('status')
      .notEmpty()
      .withMessage('Status field is required')
      .customSanitizer(status => status.toLowerCase())
      .isIn(['sold', 'available'])
      .withMessage('Status should be available or sold');

    const errors = req.validationErrors();
    if (errors) {
      next(new ApiError(400, 'Bad Request', errors));
    }
    next();
  }

  static validateUpdatePriceProps(req, res, next) {
    req
      .checkBody('price')
      .notEmpty()
      .withMessage('Price field is required')
      .isInt()
      .withMessage('Price contain only numbers');

    const errors = req.validationErrors();
    if (errors) {
      next(new ApiError(400, 'Bad Request', errors));
    }
    next();
  }

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

  static hasToken(req, res, next) {
    const token = req.headers['x-access-token'];
    try {
      if (!token) {
        next();
      }
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
        try {
          if (error) {
            next();
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

  static isAdmin(req, res, next) {
    req.isAdmin = false;
    const token = req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
        authRepository.findById(decoded.id, queryById)
          .then((result) => {
            if (result.rows[0].isadmin === true) {
              req.isAdmin = true;
              req.decoded = decoded;
              next();
            } else {
              req.decoded = decoded;
              next();
            }
          }).catch((err) => {
            next(new ApiError(404, 'Not Found', [new ErrorDetail('Headers', 'x-access-token', 'User is not in our database', req.decoded.id)]));
          });
      });
    } else {
      next();
    }
  }

  static isOwner(req, res, next) {
    const userId = JSON.parse(req.decoded.id);
    const result = carRepository.findById(Number(req.params.id));
    result.then((car) => {
      if (userId !== car.rows[0].owner) {
        next(new ApiError(401, 'Unauthorizied', [new ErrorDetail('Headers', 'userId', 'You do not have permission to perform this action', req.decoded.id)]));
      } else {
        next();
      }
    }).catch((err) => {
      next(new ApiError(404, 'Not Found', [new ErrorDetail('Params', 'carId', 'Car is not in our database', req.params.id)]));
    });
  }

  static canDelete(req, res, next) {
    const userId = JSON.parse(req.decoded.id);
    const userQueryResult = authRepository.findById(Number(userId));
    userQueryResult.then((userResult) => {
      const carQueryResult = carRepository.findById(Number(req.params.id));
      carQueryResult.then((carResult) => {
        if (userId === carResult.rows[0].owner || userResult.rows[0].isadmin === true) {
          next();
        } else {
          next(new ApiError(401, 'Unauthorizied', [new ErrorDetail('Headers', 'userId', 'You do not have permission to perform this action', req.decoded.id)]));
        }
      }).catch((error) => {
        next(new ApiError(404, 'Not Found', [new ErrorDetail('Params', 'carId', 'Car is not in our database', req.params.id)]));
      });
    }).catch((error) => {
      next(new ApiError(404, 'Not Found', [new ErrorDetail('Headers', 'x-access-token', 'User is not in our database', req.decoded.id)]));
    });
  }
}
