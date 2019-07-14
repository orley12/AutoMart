import express from 'express';
import flagMiddleWare from '../middleware/flagMiddleWare';
import flagController from '../controller/flagController';

const router = express.Router();

const {
  canWrite,
  validateFlagProps,

} = flagMiddleWare;

const {
  flag,
} = flagController;

router.post('/', [canWrite, validateFlagProps], flag);

export default router;
