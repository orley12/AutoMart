import express from 'express';

// eslint-disable-next-line import/extensions
import authMiddleWare from '../middleware/authMiddleware';
import authController from '../controller/authController';

const router = express.Router();

router.post('/signup', authMiddleWare.loggedIn, authController.signUp);

router.post('/signin', authMiddleWare.loggedIn, authController.signIn);

router.post('/:email/resetPassword', authController.resetPassword);


export default router;
