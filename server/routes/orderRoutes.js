import express from 'express';

// eslint-disable-next-line import/extensions
import orderMiddleWare from '../middleware/orderMiddleware';
import orderController from '../controller/orderController';

const router = express.Router();

router.post('/', orderMiddleWare.canWrite, orderController.createOrder);

// router.patch('/:id/status', [carMiddleWare.canWrite, carMiddleWare.isOwner], carController.updateCarStatus);

export default router;
