import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApiError from '../error/ApiError';
import carRepository from '../repository/carRepository';
import authRepository from '../repository/authRepository';

dotenv.config();

export default class CarMiddleware {
  // eslint-disable-next-line consistent-return
  static canWrite(req, res, next) {
    const token = req.headers['x-access-token'];
    try {
      if (!token) {
        throw new ApiError(400, 'Bad Request', ['No token was provided']);
      }
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
        try {
          if (error) {
            throw new ApiError(401, 'Unauthorized', ['Failed to authenticate token']);
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

  static isOwner(req, res, next) {
    const userId = JSON.parse(req.decoded.id);
    const car = carRepository.findById(Number(req.params.id));
    try {
      if (userId !== car.owner) {
        throw new ApiError(401, 'Unauthorizied', ['You do not have permission to perform this action']);
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  static canDelete(req, res, next) {
    const userId = JSON.parse(req.decoded.id);
    const user = authRepository.findById(Number(req.params.id));
    const car = carRepository.findById(Number(req.params.id));
    if (car !== undefined) {
      try {
        if (userId === car.owner || user.isAdmin === true) {
          next();
        } else {
          throw new ApiError(401, 'Unauthorizied', ['You do not have permission to perform this action']);
        }
      } catch (error) {
        next(error);
      }
    }
  }
}
