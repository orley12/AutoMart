import express from 'express';

import OrderMiddleWare from '../middleware/orderMiddleware';
import OrderController from '../controller/orderController';

const {
  canWrite, isOwner, validateOrderProps, validateUpdateOrderProps, userExist,
} = OrderMiddleWare;
const {
  createOrder,
  updateOrder,
  // getByOwner,
  // getByCarId,
  // updateStatus,
} = OrderController;

const router = express.Router();

router.post('/', [canWrite, userExist, validateOrderProps], createOrder);

router.patch('/:id/price', [canWrite, isOwner, validateUpdateOrderProps], updateOrder);

// router.get('/:owner', getByOwner);

// router.get('/:carId', getByCarId);

// router.patch('/:id/status', updateStatus);

export default router;
