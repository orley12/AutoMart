/* eslint-disable no-param-reassign */
import db from '../model/db';
import {
  createCar,
} from '../model/queries/carQueries';

export default class carService {
  static async save(car, user, files) {
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
      car.interiorImg, car.engineImg, user.email, user.id];
    const result = await db.query(createCar, carData);
    return result;
  }

  // static findAll() {
  //   const allCars = [];
  //   // eslint-disable-next-line no-unused-vars
  //   cars.forEach((value, key) => {
  //     allCars.push(value);
  //   });
  //   return allCars;
  // }

  // static findAllUnsold() {
  //   const allUnsoldCars = [];
  //   // eslint-disable-next-line no-unused-vars
  //   cars.forEach((value, key) => {
  //     if (value.status === 'unsold') {
  //       allUnsoldCars.push(value);
  //     }
  //   });
  //   return allUnsoldCars;
  // }

  // static findById(id) {
  //   return cars.get(id);
  // }

  // static update(carId, status, price) {
  //   const car = cars.get(Number(carId));
  //   if (price === null) {
  //     car.status = status;
  //   } else if (status === null) {
  //     car.price = price;
  //   }
  //   car.updatedOn = Date.now();
  //   cars.set(car.id, car);
  //   return car;
  // }

  // static delete(id) {
  //   if (cars.has(id)) {
  //     console.log('came here');
  //     return cars.delete(id);
  //   }
  //   return 'Not Found';
  // }

  // static saveFlag(userId, carId, flag) {
  //   flag.owner = userId;
  //   flag.carId = carId;
  //   flag.createdOn = Date.now();
  //   flag.id = flags.size;

  //   flags.set(flag.id, flag);
  //   return flags.get(flag.id);
  // }
}
