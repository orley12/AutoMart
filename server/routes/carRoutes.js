import express from 'express';
import multipart from 'connect-multiparty';

// eslint-disable-next-line import/extensions
import carMiddleWare from '../middleware/carMiddleware';
import carController from '../controller/carController';

const multipartMiddleware = multipart();
const router = express.Router();

router.post('/', [multipartMiddleware, carMiddleWare.canWrite], carController.createCar);

export default router;
