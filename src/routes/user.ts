import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.route('/create')
  .post(UserController.createUser)

router.route('/list')
  .get(UserController.getUsers)

router.route('/login')
  .post(UserController.handleLogin)

export default router;
