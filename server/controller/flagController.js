import ApiError from '../error/ApiError';
import FlagRepository from '../repository/flagRepository';
import ErrorDetail from '../error/ErrorDetail';
import CarRepository from '../repository/carRepository';

export default class CarController {
  static async flag(req, res, next) {
    try {
      const { rows: carRows } = await CarRepository.findById(Number(req.body.carId));
      if (carRows.length < 1) {
        throw new ApiError(404, 'Not found',
          [new ErrorDetail('param', 'car id', 'car was not found', req.body.carId)]);
      }


      const { rows: flagRows } = await FlagRepository.saveFlag(req.decoded.id, carRows[0].id, req.body);
      if (flagRows.length < 1) {
        throw new ApiError(500, 'Internal Server Error',
          [new ErrorDetail('saveFlag', 'car id', 'no return value from flag operation', req.body.id)]);
      }

      res.status(200).json({
        status: 200,
        message: 'Car flaged',
        data: {
          ...flagRows[0],
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
