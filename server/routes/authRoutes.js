import express from 'express';

import AuthValidator from '../middleware/authValidator';
import AuthController from '../controller/authController';

const router = express.Router();
const { signUp, signIn, resetPassword } = AuthController;
const {
  loggedIn, validateSignUpProps, validateSignInProps, resetValidator,
} = AuthValidator;


router.post('/signup', [loggedIn, validateSignUpProps], signUp);

router.post('/signin', [loggedIn, validateSignInProps], signIn);

router.post('/:email/resetPassword', resetValidator, resetPassword);


export default router;
