/* eslint-disable no-param-reassign */
const cars = new Map();

export default class CarRepository {
  static save(owner, car, files) {
    car.id = cars.size;
    car.status = 'unsold'; // sold,available - default is available
    car.owner = owner.id;
    car.ownerEmail = owner.email;
    car.createdOn = Date.now();
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
    cars.set(car.id, car);
    return cars.get(car.id);
  }

  static findAll() {
    const allCars = [];
    // eslint-disable-next-line no-unused-vars
    cars.forEach((value, key) => {
      allCars.push(value);
    });
    return allCars;
  }

  static findAllUnsold() {
    const allUnsoldCars = [];
    // eslint-disable-next-line no-unused-vars
    cars.forEach((value, key) => {
      if (value.status === 'unsold') {
        allUnsoldCars.push(value);
      }
    });
    return allUnsoldCars;
  }

  static findById(id) {
    return cars.get(id);
  }

  static update(carId, status) {
    const car = cars.get(Number(carId));
    car.status = status;
    car.updatedOn = Date.now();
    cars.set(car.id, car);
    return car;
  }
}
