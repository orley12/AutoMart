import express from 'express';
import multipart from 'connect-multiparty';

// eslint-disable-next-line import/extensions
import carMiddleWare from '../middleware/carMiddleware';
import carController from '../controller/carController';

const {
  canWrite, isOwner, validateUpdateStatusProps, validateUpdatePriceProps, canDelete, isAdmin,
} = carMiddleWare;
const {
  createCar, getCars, updateCarStatus, updateCarPrice, getCar, deleteCar, flag,
} = carController;


const multipartMiddleware = multipart();
const router = express.Router();

router.post('/', [multipartMiddleware, canWrite], createCar);

router.get('/', isAdmin, getCars);

router.patch('/:id/status', [canWrite, isOwner, validateUpdateStatusProps], updateCarStatus);

router.patch('/:id/price', [canWrite, isOwner, validateUpdatePriceProps], updateCarPrice);

router.get('/:id', canWrite, getCar);

router.delete('/:id', [canWrite, canDelete], deleteCar);

router.post('/:id/flag', canWrite, flag);

export default router;
