import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApiError from '../error/ApiError';
import carRepository from '../repository/carRepository';
import authRepository from '../repository/authRepository';
import { queryById } from '../model/queries/authQueries';

dotenv.config();

export default class CarMiddleware {
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

  static isAdmin(req, res, next) {
    req.isAdmin = false;
    const token = req.headers['x-access-token'];
    if (token) {
      try {
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
            }).catch(err => console.log(err));
        });
      } catch (err) {
        next();
      }
    } else {
      next();
    }
  }

  static isOwner(req, res, next) {
    const userId = JSON.parse(req.decoded.id);
    const result = carRepository.findById(Number(req.params.id));
    result.then((car) => {
      console.log(car);
      try {
        if (userId !== car.rows[0].owner) {
          throw new ApiError(401, 'Unauthorizied', ['You do not have permission to perform this action']);
        }
        next();
      } catch (error) {
        next(error);
      }
    }).catch((err) => {
      console.log(err);
      next(new ApiError(404, 'Not Found', ['User not found']));
    });
  }

  // static canDelete(req, res, next) {
  //   const userId = JSON.parse(req.decoded.id);
  //   const user = authRepository.findById(Number(req.params.id));
  //   const car = carRepository.findById(Number(req.params.id));
  //   if (car) {
  //     try {
  //       if (userId === car.owner || user.isAdmin === true) {
  //         next();
  //       } else {
  //         throw new ApiError(401, 'Unauthorizied', ['You do not have permission to perform this action']);
  //       }
  //     } catch (error) {
  //       next(error);
  //     }
  //   } else {
  //     next(new ApiError(404, 'Not Found', ['The car is not in our database']));
  //   }
  // }
}
