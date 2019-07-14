/* eslint-disable no-param-reassign */
import db from '../model/db';
import ApiError from '../error/ApiError';
import ErrorDetail from '../error/ErrorDetail';
import {
  createCar,
  queryAll,
  queryAllUnsold,
  updateCarStatus,
  queryById,
  updateCarPrice,
  deletecar,
  createFlag,
} from '../model/queries/carQueries';

export default class CarRepository {
  static save(car, user, files) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      if (files[i].public_id.includes('exterior')) {
        car.exteriorImg = files[i].secure_url;
      } else if (files[i].public_id.includes('interior')) {
        car.interiorImg = files[i].secure_url;
      } else if (files[i].public_id.includes('engine')) {
        car.engineImg = files[i].secure_url;
      }
    }

    const carData = [car.state, car.price, car.manufacturer, car.model, car.bodyType,
      car.transmission, car.milage, car.year, car.exteriorImg,
      car.interiorImg, car.engineImg, car.location, user.id];
    try {
      return db.query(createCar, carData);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('body', 'Car Properties', 'Unable to save car', carData)]);
    }
  }

  static findAll() {
    try {
      return db.query(queryAll);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('findAll', 'null', 'Unable to get all cars', 'null')]);
    }
  }

  static findAllUnsold() {
    try {
      return db.query(queryAllUnsold, ['available']);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('findAllUnsold', 'null', 'Unable to get all available cars', 'null')]);
    }
  }

  static updateStatus(carId, status) {
    try {
      return db.query(updateCarStatus, [status, carId]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('updateStatus', 'car id & status', 'Unable to update car', `${status} & ${carId}`)]);
    }
  }

  static findById(carId) {
    try {
      return db.query(queryById, [carId]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('findById', 'car id', 'Unable to find car by id', carId)]);
    }
  }

  static updatePrice(carId, price) {
    try {
      return db.query(updateCarPrice, [price, carId]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('updatePrice', 'car id & price', 'Unable to update car', `${price} & ${carId}`)]);
    }
  }

  static delete(carId) {
    try {
      return db.query(deletecar, [carId]);
    } catch (error) {
      throw new ApiError(500, 'Internal Server Error',
        [new ErrorDetail('Params', 'car id', 'Unable to delete AD', carId)]);
    }
  }
}
