import express from 'express';
import multipart from 'connect-multiparty';

// eslint-disable-next-line import/extensions
import carMiddleWare from '../middleware/carMiddleware';
import carController from '../controller/carController';

const multipartMiddleware = multipart();
const router = express.Router();

router.post('/', [multipartMiddleware, carMiddleWare.canWrite], carController.createCar);

router.get('/', carMiddleWare.hasToken, carController.getCars);

router.patch('/:id/status', [carMiddleWare.canWrite, carMiddleWare.isOwner], carController.updateCarStatus);

export default router;
