import express from 'express';

import { createUser, getUserById, getUsers, handleLogin } from '../controllers/user/user.controller';
import validate from '../middleware/validateResource';
import { createUserSchema, getUserByIdSchema, userLoginSchema } from '../schema/user.schema';

const router = express.Router();

router.route('/create')
  .post(validate(createUserSchema), createUser)

router.route('/list')
  .get(getUsers)

router.route('/:id')
  .get(validate(getUserByIdSchema), getUserById)

router.route('/login')
  .post(validate(userLoginSchema), handleLogin)

export default router;
