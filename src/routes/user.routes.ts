import express from 'express';
import {
  createUser,
  getUser,
  getUsers,
  handleLogin,
} from '../modules/user/user.controller';
import validate from '../middleware/validateResource';
import {
  createUserSchema,
  getUserSchema,
  userLoginSchema,
} from '../modules/user/user.schema';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.route('/create').post(validate(createUserSchema), createUser);

router.route('/list').get(getUsers);

router.route('/:id').get(validate(getUserSchema), getUser);

router.route('/login').post(validate(userLoginSchema), handleLogin);

router.route('/abcde').post(verifyToken(), getUsers);

export default router;
