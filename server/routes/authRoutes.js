import express from 'express';

import AuthMiddleware from '../middleware/authMiddleware';
import AuthController from '../controller/authController';

const router = express.Router();
const {
  signUp,
  signIn,
  getUsers,
  resetPassword,
  updateStatus,
} = AuthController;
const {
  loggedIn,
  validateSignUpProps,
  validateSignInProps,
  resetMapper,
  canWrite,
  isAdmin,
} = AuthMiddleware;


router.post('/signup', [loggedIn, validateSignUpProps], signUp);

router.post('/signin', [loggedIn, validateSignInProps], signIn);

router.get('/users', canWrite, isAdmin, getUsers);

router.patch('/:id/status', canWrite, isAdmin, updateStatus);

router.post('/:email/resetPassword', resetMapper, resetPassword);


export default router;
