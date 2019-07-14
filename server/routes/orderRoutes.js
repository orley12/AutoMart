import express from 'express';

import OrderMiddleWare from '../middleware/orderMiddleware';
import OrderController from '../controller/orderController';

const {
  canWrite, isOwner, validateOrderProps, validateUpdateOrderProps, userExist, canAccept,
} = OrderMiddleWare;
const {
  createOrder,
  updatePrice,
  getByOwner,
  getOrder,
  updateStatus,
} = OrderController;

const router = express.Router();

router.post('/', [canWrite, userExist, validateOrderProps], createOrder);

router.get('/', canWrite, getByOwner);

router.get('/:id', [canWrite, isOwner], getOrder);

router.patch('/:id/price', [canWrite, isOwner, validateUpdateOrderProps], updatePrice);

router.patch('/:id/status', [canWrite, canAccept], updateStatus);

export default router;
