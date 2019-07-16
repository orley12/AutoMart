import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApiError from '../error/ApiError';
import CarRepository from '../repository/carRepository';
import AuthRepository from '../repository/authRepository';
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

  static canWrite(req, res, next) {
    console.log(req.body);
    const token = req.headers['x-access-token'] || req.header('x-access-token') || req.body.token || req.headers.token;
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

  static hasToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      next();
    } else {
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (decoded) {
          req.decoded = decoded;
          next();
        } else {
          next();
        }
      });
    }
  }

  static async isAdmin(req, res, next) {
    try {
      req.isAdmin = false;
      if (req.decoded) {
        const { rows } = await AuthRepository.findById(req.decoded.id);
        if (rows.length > 0) {
          /* istanbul ignore next */
          if (rows[0].is_admin === true) {
            req.isAdmin = true;
            next();
          } else {
            next();
          }
        }
      } else {
        next();
      }
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async isOwner(req, res, next) {
    try {
      const userId = req.decoded.id;

      const { rows } = await CarRepository.findById(Number(req.params.id));
      if (rows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('Params', 'carId', 'Car is not in our database', req.params.id)]);
      }

      console.log('IS ADMIN');
      console.log(userId === rows[0].owner);
      console.log('IS ADMIN');

      if (userId !== rows[0].owner) {
        throw new ApiError(401, 'Unauthorizied',
          [new ErrorDetail('Headers', 'userId', 'You do not have permission to perform this action', req.decoded.id)]);
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  }

  static async canDelete(req, res, next) {
    try {
      // next();
      const userId = JSON.parse(req.decoded.id);

      const { rows: userRows } = await AuthRepository.findById(Number(userId));
      if (userRows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('Headers', 'x-access-token', 'User is not in our database', req.decoded.id)]);
      }

      const { rows: carRows } = await CarRepository.findById(Number(req.params.id));
      if (carRows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('Params', 'carId', 'Car is not in our database', req.params.id)]);
      }

      if (userId === carRows[0].owner || userRows[0].is_admin === true) {
        next();
      } else {
        throw new ApiError(401, 'Unauthorizied',
          [new ErrorDetail('Headers', 'userId', 'You do not have permission to perform this action', req.decoded.id)]);
      }
    } catch (error) {
      next(error);
    }
  }
}
