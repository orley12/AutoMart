import express from 'express';
import multipart from 'connect-multiparty';

// eslint-disable-next-line import/extensions
import carMiddleWare from '../middleware/carMiddleware';
import carController from '../controller/carController';

const {
  canWrite,
  isOwner,
  // validateUpdateStatusProps,
  validateUpdatePriceProps,
  canDelete,
  isAdmin,
  hasToken,
} = carMiddleWare;
const {
  createCar, getCars, updateCarStatus, updateCarPrice, getCar, deleteCar, getOrderByCarId,

} = carController;


const multipartMiddleware = multipart();
const router = express.Router();

router.post('/', [multipartMiddleware, canWrite], createCar);

router.get('/', [hasToken, isAdmin], getCars);

router.patch('/:id/status', [canWrite, isOwner], updateCarStatus);

router.patch('/:id/price', [canWrite, isOwner, validateUpdatePriceProps], updateCarPrice);

router.get('/:id', canWrite, getCar);

router.delete('/:id', [canWrite, canDelete], deleteCar);

router.get('/:id/orders', [canWrite, isOwner], getOrderByCarId);

export default router;
