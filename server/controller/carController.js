import carUtils from '../util/carUtil';
import ApiError from '../error/ApiError';
import carRepository from '../repository/carRepository';
import authRepository from '../repository/authRepository';

export default class CarController {
  // eslint-disable-next-line consistent-return
  static createCar(req, res, next) {
    const userId = JSON.parse(req.decoded.id);
    try {
      const carData = JSON.parse(req.body.data);
      const errors = carUtils.validatePropsCreateCar(carData);
      if (errors.length > 0) {
        throw new ApiError(400, 'Bad Request', errors);
      }
      console.log(carData);
      const filekeys = Object.keys(req.files);
      const filePromises = carUtils.fileUploadPromises(req.files, filekeys);
      if (filePromises.length < 1 || filePromises.length > 3) {
        throw new ApiError(400, 'Bad Request', ['Photos most be between 1 & 3']);
      }
      Promise.all(filePromises).then((files) => {
        const user = authRepository.findById(userId);
        const car = carRepository.save(user, carData, files);
        res.status(201).json({
          status: 201,
          message: `${car.manufacturer} ${car.model} Created`,
          data: {
            id: car.id,
            email: car.ownerEmail,
            created_on: car.created_on,
            manufacturer: car.manufacturer,
            model: car.model,
            price: car.price,
            state: car.state,
            status: car.status,
            bodyType: car.bodyType, // car, truck, trailer, van, etc
            transnmission: car.transmission,
            milage: car.milage,
            year: car.year,
            exteriorImg: car.exteriorImg,
            interiorImg: car.interiorImg,
            engineImg: car.engineImg,
          },
        });
      // eslint-disable-next-line no-unused-vars
      }).catch((error) => {
        next(new ApiError(408, 'Request Timeout', 'Unable to upload Photos'));
      });
    } catch (error) {
      next(error);
    }
  }
}
