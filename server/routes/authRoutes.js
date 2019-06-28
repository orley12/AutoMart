import express from 'express';

import AuthMiddleware from '../middleware/authMiddleware';
import AuthController from '../controller/authController';

const router = express.Router();
const { signUp, signIn, resetPassword } = AuthController;
const {
  loggedIn, validateSignUpProps, validateSignInProps, resetValidator,
} = AuthMiddleware;


router.post('/signup', [loggedIn, validateSignUpProps], signUp);

router.post('/signin', [loggedIn, validateSignInProps], signIn);

router.post('/:email/resetPassword', resetValidator, resetPassword);


export default router;
