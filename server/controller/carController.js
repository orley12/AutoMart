/* eslint-disable max-len */
import carUtils from '../util/carUtil';
import ApiError from '../error/ApiError';
import carRepository from '../repository/carRepository';
import authRepository from '../repository/authRepository';

export default class CarController {
  // eslint-disable-next-line consistent-return
  static createCar(req, res, next) {
    const userId = req.decoded.id;
    try {
      const carProps = JSON.parse(req.body.data);
      carUtils.validatePropsCreateCar(carProps);

      const filekeys = Object.keys(req.files);
      const filePromises = carUtils.fileUploadPromises(req.files, filekeys);

      Promise.all(filePromises).then((files) => {
        const user = authRepository.findById(userId);
        user.then(userData => carRepository.save(carProps, userData.rows[0], files))
          .then((carData) => {
            const car = carData.rows[0];
            res.status(201).json({
              status: 201,
              message: `${car.manufacturer} ${car.model} Created`,
              data: {
                ...car,
              },
            });
          });
      // eslint-disable-next-line no-unused-vars
      }).catch((error) => {
        next(new ApiError(408, 'Request Timeout', 'Unable to upload Photos'));
      });
    } catch (error) {
      next(error);
    }
  }

  static getCars(req, res) {
    let results = {};
    if (req.isAdmin === true) {
      results = carRepository.findAll();
    } else {
      results = carRepository.findAllUnsold();
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
    if (req.body.status) {
      if (req.body.status.toLowerCase() === 'sold' || req.body.status.toLowerCase() === 'available') {
        const updateResult = carRepository.updateStatus(Number(req.params.id), req.body.status);
        updateResult.then((result) => {
          const updatedCar = result.rows[0];
          res.json({
            status: 200,
            message: `${updatedCar.manufacturer} ${updatedCar.model} Updated`,
            data: {
              ...updatedCar,
            },
          });
        }).catch(error => console.log(error));
      } else {
        next(new ApiError(400, 'Bad Request', ['Invalid status']));
      }
    } else {
      next(new ApiError(400, 'Bad Request', ['No status provided']));
    }
  }

  static updateCarPrice(req, res, next) {
    if (req.body.price) {
      if (typeof (Number(req.body.price)) === 'number' || req.body.price !== '') {
        const updateResult = carRepository.updatePrice(Number(req.params.id), req.body.price);
        updateResult.then((result) => {
          const updatedCar = result.rows[0];
          res.json({
            status: 200,
            message: `${updatedCar.manufacturer} ${updatedCar.model} Updated`,
            data: {
              ...updatedCar,
            },
          });
        }).catch(error => console.log(error));
      } else {
        next(new ApiError(400, 'Bad Request', ['Invalid price']));
      }
    } else {
      next(new ApiError(400, 'Bad Request', ['No price provided']));
    }
  }

  static getCar(req, res, next) {
    const queryResult = carRepository.findById(Number(req.params.id));
    queryResult.then((result) => {
      const car = result.rows[0];
      if (car) {
        res.status(200).json({
          status: 200,
          message: 'success',
          data: {
            ...car,
          },
        });
      } else {
        next(new ApiError(404, 'Not Found', ['The car is not in our database']));
      }
    }).catch(error => console.log(error));
  }

  // static deleteCar(req, res, next) {
  //   const deletedCar = carRepository.delete(Number(req.params.id));
  //   if (deletedCar === true) {
  //     res.status(200).json({
  //       status: 200,
  //       message: 'Request Successful',
  //       data: 'Car Ad successfully deleted',
  //     });
  //   } else {
  //     next(new ApiError(403, 'Bad Request', ['Unable to delete AD']));
  //   }
  // }

  // static flag(req, res, next) {
  //   if (req.body.reason) {
  //     const user = authRepository.findById(Number(req.decoded.id));
  //     const car = carRepository.findById(Number(req.params.id));
  //     const flag = carRepository.saveFlag(user.id, car.id, req.body);
  //     res.status(200).json({
  //       status: 200,
  //       message: 'Car flaged',
  //       data: {
  //         id: flag.id,
  //         carId: flag.carId,
  //         reason: flag.reason,
  //         description: flag.description,
  //       },
  //     });
  //   } else {
  //     next(new ApiError(400, 'Bad Request', ['Request not success']));
  //   }
  // }
}
