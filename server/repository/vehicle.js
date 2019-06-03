/* eslint-disable no-param-reassign */
const Car = {};
const cars = new Map();

Car.save = (car, files) => {
  console.log(files[0].public_id.includes('exterior'));
  car.id = cars.size;
  car.status = 'unsold'; // sold,available - default is available
  for (let i = 0; i < files.length; i++) {
    if (files[i].public_id.includes('exterior')) {
      car.exterior_img = files[i].secure_url;
    } else if (files[i].public_id.includes('interior')) {
      car.interior_img = files[i].secure_url;
    } else if (files[i].public_id.includes('engine')) {
      car.engine_img = files[i].secure_url;
    }
  }
  cars.set(car.id, car);
  return cars.get(car.id);
};

module.exports = Car;
