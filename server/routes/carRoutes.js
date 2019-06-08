import express from 'express';
import multipart from 'connect-multiparty';

// eslint-disable-next-line import/extensions
import carMiddleWare from '../middleware/carMiddleware';
import carController from '../controller/carController';

const multipartMiddleware = multipart();
const router = express.Router();

router.post('/', [multipartMiddleware, carMiddleWare.canWrite], carController.createCar);

router.get('/', carController.getCars);

router.patch('/:id/status', [carMiddleWare.canWrite, carMiddleWare.isOwner], carController.updateCarStatus);

router.patch('/:id/price', [carMiddleWare.canWrite, carMiddleWare.isOwner], carController.updateCarPrice);

router.get('/:id', carMiddleWare.canWrite, carController.getCar);

router.delete('/:id', [carMiddleWare.canWrite, carMiddleWare.canDelete], carController.deleteCar);

router.post('/:id/flag', carMiddleWare.canWrite, carController.flag);

export default router;
