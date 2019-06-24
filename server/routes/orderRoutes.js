import express from 'express';

// eslint-disable-next-line import/extensions
import orderMiddleWare from '../middleware/orderMiddleware';
import orderController from '../controller/orderController';

const router = express.Router();

router.post('/', orderMiddleWare.canWrite, orderController.createOrder);

// router.patch('/:id/price', [orderMiddleWare.canWrite, orderMiddleWare.isOwner], orderController.updateOrder);

export default router;
