/* eslint-disable max-len */
import CarUtils from '../util/carUtil';
import ApiError from '../error/ApiError';
import CarRepository from '../repository/carRepository';
import AuthRepository from '../repository/authRepository';
import ErrorDetail from '../error/ErrorDetail';

const { validatePropsCreateCar } = CarUtils;

export default class CarController {
  // eslint-disable-next-line consistent-return
  static createCar(req, res, next) {
    const userId = req.decoded.id;
    const props = ['price', 'state', 'manufacturer', 'model', 'bodyType'];
    try {
      const carProps = JSON.parse(req.body.data);
      validatePropsCreateCar(carProps, props);

      const filekeys = Object.keys(req.files);
      const filePromises = CarUtils.fileUploadPromises(req.files, filekeys);

      Promise.all(filePromises).then((files) => {
        AuthRepository.findById(userId)
          .then((userData) => {
            CarRepository.save(carProps, userData.rows[0], files)
              .then((carData) => {
                const car = carData.rows[0];
                res.status(201).json({
                  status: 201,
                  message: `${car.manufacturer} ${car.model} Created`,
                  data: {
                    ...car,
                  },
                });
              }).catch(() => {
                next(new ApiError(500, 'Internal Server Error', [new ErrorDetail('body', 'Car Properties', 'Unable to save car', carProps)]));
              });
          }).catch(() => {
            next(new ApiError(404, 'Not Found', [new ErrorDetail('header', 'x-accass-token', 'User not found', userId)]));
          });
      }).catch(() => {
        next(new ApiError(408, 'Request Timeout', [new ErrorDetail('body', 'Images', 'Unable to upload Photos', userId)]));
      });
    } catch (error) {
      next(error);
    }
  }

  static getCars(req, res) {
    let results = {};
    if (req.isAdmin === true) {
      results = CarRepository.findAll();
    } else {
      results = CarRepository.findAllUnsold();
    }
    results.then((cars) => {
      let carArray = cars.rows;
      if (req.query.manufacturer) {
        // eslint-disable-next-line max-len
        carArray = carArray.filter(car => req.query.manufacturer.toLowerCase() === car.manufacturer.toLowerCase());
      }
      if (req.query.state) {
        carArray = carArray.filter(car => req.query.state.toLowerCase() === car.state.toLowerCase());
      }
      if (req.query.bodytype) {
        carArray = carArray.filter(car => req.query.bodytype.toLowerCase() === car.bodytype.toLowerCase());
      }
      if (req.query.minPrice) {
        carArray = carArray.filter(car => (Number(car.price) >= Number(req.query.minPrice)));
      }
      if (req.query.maxPrice) {
        carArray = carArray.filter(car => (Number(car.price) <= Number(req.query.maxPrice)));
      }
      res.json({
        status: 200,
        message: 'success',
        data: carArray,
      });
    }).catch(error => console.log(error));
  }

  static updateCarStatus(req, res, next) {
    CarRepository.updateStatus(Number(req.params.id), req.body.status)
      .then((result) => {
        const updatedCar = result.rows[0];
        res.json({
          status: 200,
          message: `${updatedCar.manufacturer} ${updatedCar.model} Updated`,
          data: {
            ...updatedCar,
          },
        });
      }).catch(() => {
        next(new ApiError(400, 'Bad Request', [new ErrorDetail('Params', 'CarId', 'Invalid carId', req.params.id)]));
      });
  }

  static updateCarPrice(req, res, next) {
    CarRepository.updatePrice(Number(req.params.id), req.body.price)
      .then((result) => {
        const updatedCar = result.rows[0];
        res.json({
          status: 200,
          message: `${updatedCar.manufacturer} ${updatedCar.model} Updated`,
          data: {
            ...updatedCar,
          },
        });
      }).catch(() => {
        next(new ApiError(400, 'Bad Request', [new ErrorDetail('Params', 'CarId', 'Invalid carId', req.params.id)]));
      });
  }

  static getCar(req, res, next) {
    CarRepository.findById(Number(req.params.id))
      .then((result) => {
        const car = result.rows[0];
        if (car) {
          res.status(200).json({
            status: 200,
            message: 'success',
            data: {
              ...result.rows[0],
            },
          });
        } else {
          next(new ApiError(404, 'Not Found', [new ErrorDetail('Params', 'carId', 'Car is not in our database', req.params.id)]));
        }
      }).catch(() => {
        next(new ApiError(404, 'Not Found', [new ErrorDetail('Params', 'carId', 'Car is not in our database', req.params.id)]));
      });
  }

  static deleteCar(req, res, next) {
    CarRepository.delete(Number(req.params.id))
      .then(() => {
        res.status(200).json({
          status: 200,
          message: 'Request Successful',
          data: 'Car Ad successfully deleted',
        });
      }).catch(() => {
        next(new ApiError(500, 'Internal Server Error', [new ErrorDetail('Params', 'carId', 'Unable to delete AD', req.params.id)]));
      });
  }

  static flag(req, res, next) {
    CarRepository.findById(Number(req.params.id))
      .then((carResult) => {
        CarRepository.saveFlag(Number(req.decoded.id), carResult.rows[0].id, req.body)
          .then((saveResult) => {
            res.status(200).json({
              status: 200,
              message: 'Car flaged',
              data: {
                ...saveResult.rows[0],
              },
            });
          }).catch(() => {
            next(new ApiError(500, 'Internal Server Error', [new ErrorDetail('Body', 'Flag Data', 'Car could not be flagged', req.body)]));
          });
      }).catch(() => {
        next(new ApiError(404, 'Not Found', [new ErrorDetail('Params', 'carId', 'Car is not in our database', req.params.id)]));
      });
  }
}
