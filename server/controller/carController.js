/* eslint-disable max-len */
import cloudinary from 'cloudinary';
import CarUtil from '../util/carUtil';
import ApiError from '../error/ApiError';
import CarRepository from '../repository/carRepository';
import AuthRepository from '../repository/authRepository';
import OrderRepository from '../repository/orderRepository';
import ErrorDetail from '../error/ErrorDetail';

cloudinary.v2.config({
  cloud_name: 'automart-api',
  api_key: '168729795321398',
  api_secret: 'dRX06FUg-zSy36Flbv9qixJ_AdQ',
});

const { validatePropsCreateCar } = CarUtil;

export default class CarController {
  // eslint-disable-next-line consistent-return
  static async createCar(req, res, next) {
    try {
      const userId = req.decoded.id;
      const props = ['price', 'state', 'manufacturer', 'model', 'body_type'];

      const carProps = req.body;
      validatePropsCreateCar(carProps, props);

      const { rows: userRows } = await AuthRepository.findById(userId);
      if (userRows.length < 1) {
        throw new ApiError(404, 'Not Found', [new ErrorDetail('header', 'x-access-token', 'User not found', userId)]);
      }
      let exterior = '';
      let interior = '';
      let engine = '';

      if (req.files) {
        if (req.files.exterior) {
          exterior = await cloudinary.v2.uploader.upload(req.files.exterior.path, { folder: 'exterior/', use_filename: true, unique_filename: false });
        } else if (req.files.interior) {
          interior = await cloudinary.v2.uploader.upload(req.files.interior.path, { folder: 'interior/', use_filename: true, unique_filename: false });
        } else if (req.files.engine) {
          engine = await cloudinary.v2.uploader.upload(req.files.engine.path, { folder: 'engine/', use_filename: true, unique_filename: false });
        }
        carProps.img_url = req.img_url;
      }

      carProps.exterior = exterior.url;
      carProps.interior = interior.url;
      carProps.engine = engine.url;

      const { rows: carRows } = await CarRepository.save(carProps, userRows[0]);
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
    } catch (e) {
      console.log(e);
      next(e);
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
      res.status(200).json({
        status: 200,
        message: 'success',
        data: carArray,
      });
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }

  static async updateCarStatus(req, res, next) {
    try {
      const { status } = req.body;

      const { rows } = await CarRepository.updateStatus(Number(req.params.id), status);
      if (rows.length < 1) {
        throw new ApiError(500, 'Internal Server Error',
          [new ErrorDetail('updateStatus', 'car id', 'no return value from update operation', req.params.id)]);
      }

      const updatedCar = rows[0];
      res.status(200).json({
        status: 200,
        message: `${updatedCar.manufacturer} ${updatedCar.model} Updated`,
        data: {
          ...updatedCar,
        },
      });
    } catch (error) {
      /* istanbul ignore next */
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
      res.status(200).json({
        status: 200,
        message: `${updatedCar.manufacturer} ${updatedCar.model} Updated`,
        data: {
          ...updatedCar,
        },
      });
    } catch (error) {
      /* istanbul ignore next */
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
      /* istanbul ignore next */
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
