import express from 'express';

import OrderMiddleWare from '../middleware/orderMiddleware';
import OrderController from '../controller/orderController';

const {
  canWrite, isOwner, validateOrderProps, validateUpdateOrderProps,
} = OrderMiddleWare;
const { createOrder, updateOrder } = OrderController;

const router = express.Router();

router.post('/', canWrite, validateOrderProps, createOrder);

router.patch('/:id/price', [canWrite, isOwner, validateUpdateOrderProps], updateOrder);

export default router;
