/* eslint-disable max-len */
import CarUtil from '../util/carUtil';
import ApiError from '../error/ApiError';
import CarRepository from '../repository/carRepository';
import AuthRepository from '../repository/authRepository';
import OrderRepository from '../repository/orderRepository';
import ErrorDetail from '../error/ErrorDetail';

const { validatePropsCreateCar } = CarUtil;

export default class CarController {
  // eslint-disable-next-line consistent-return
  static async createCar(req, res, next) {
    const userId = req.decoded.id;
    const props = ['price', 'state', 'manufacturer', 'model', 'bodyType', 'location'];
    try {
      const carProps = JSON.parse(req.body.data);
      validatePropsCreateCar(carProps, props);

      const { rows: userRows } = await AuthRepository.findById(userId);
      if (userRows.length < 1) {
        throw new ApiError(404, 'Not Found', [new ErrorDetail('header', 'x-accass-token', 'User not found', userId)]);
      }

      const filekeys = Object.keys(req.files);
      const filePromises = CarUtil.fileUploadPromises(req.files, filekeys);

      Promise.all(filePromises).then(async (files) => {
        try {
          const { rows: carRows } = await CarRepository.save(carProps, userRows[0], files);
          if (userRows.length < 1) {
            throw new ApiError(500, 'Internal Server Error', [new ErrorDetail('save', 'car data', 'no return value from save operation', carProps)]);
          }

          const car = carRows[0];
          res.status(201).json({
            status: 201,
            message: `${car.manufacturer} ${car.model} Created`,
            data: {
              ...car,
            },
          });
        } catch (error) {
          next(error);
        }
      }).catch(() => {
        next(new ApiError(408, 'Request Timeout', [new ErrorDetail('body', 'Images', 'Unable to upload Photos', userId)]));
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCars(req, res, next) {
    let result = {};
    try {
      if (req.isAdmin === true) {
        result = await CarRepository.findAll();
      } else {
        result = await CarRepository.findAllUnsold();
      }
      let carArray = result.rows;

      if (carArray.length < 1) {
        throw new ApiError(404, 'Not found',
          [new ErrorDetail('query param', 'query', 'We could not find specified cars', req.query)]);
      }

      if (req.query.manufacturer) {
        carArray = await carArray.filter(car => req.query.manufacturer.toLowerCase() === car.manufacturer.toLowerCase());
      }
      if (req.query.state) {
        carArray = await carArray.filter(car => req.query.state.toLowerCase() === car.state.toLowerCase());
      }
      if (req.query.body_type) {
        carArray = await carArray.filter(car => req.query.body_type.toLowerCase() === car.body_type.toLowerCase());
      }
      if (req.query.min_price) {
        carArray = await carArray.filter(car => (Number(car.price) >= Number(req.query.min_price)));
      }
      if (req.query.max_price) {
        carArray = await carArray.filter(car => (Number(car.price) <= Number(req.query.max_price)));
      }
      res.json({
        status: 200,
        message: 'success',
        data: carArray,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCarStatus(req, res, next) {
    try {
      const { rows } = await CarRepository.updateStatus(Number(req.params.id), req.body.status);
      if (rows.length < 1) {
        throw new ApiError(500, 'Internal Server Error',
          [new ErrorDetail('updateStatus', 'car id', 'no return value from update operation', req.params.id)]);
      }

      const updatedCar = rows[0];
      res.json({
        status: 200,
        message: `${updatedCar.manufacturer} ${updatedCar.model} Updated`,
        data: {
          ...updatedCar,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCarPrice(req, res, next) {
    try {
      const { rows } = await CarRepository.updatePrice(Number(req.params.id), req.body.price);
      if (rows.length < 1) {
        throw new ApiError(500, 'Internal Server Error',
          [new ErrorDetail('updateCarPrice', 'car id', 'no return value from update operation', req.params.id)]);
      }

      const updatedCar = rows[0];
      res.json({
        status: 200,
        message: `${updatedCar.manufacturer} ${updatedCar.model} Updated`,
        data: {
          ...updatedCar,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCar(req, res, next) {
    try {
      const { rows } = await CarRepository.findById(Number(req.params.id));
      if (rows.length < 1) {
        throw new ApiError(404, 'Not found',
          [new ErrorDetail('param', 'car id', 'car was not found', req.params.id)]);
      }
      const car = rows[0];

      res.status(200).json({
        status: 200,
        message: 'success',
        data: {
          ...car,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCar(req, res, next) {
    try {
      const { rows } = await CarRepository.delete(Number(req.params.id));
      res.status(200).json({
        status: 200,
        message: 'Request Successful',
        data: 'Car Ad successfully deleted',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderByCarId(req, res, next) {
    const carId = Number(req.params.id);
    try {
      const { rows } = await OrderRepository.findBycarId(carId);
      if (rows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('param', 'car id', 'car as not been ordered yet', carId)]);
      }

      res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      next(error);
    }
  }
}
