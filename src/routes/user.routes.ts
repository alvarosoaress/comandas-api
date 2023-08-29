import express from 'express';

import { createUser, getUsers, handleLogin } from '../controllers/user/user.controller';
import validate from '../middleware/validateResource';
import { createUserSchema, userLoginSchema } from '../schema/user.schema';

const router = express.Router();

router.route('/create')
  .post(validate(createUserSchema), createUser)

router.route('/list')
  .get(getUsers)

router.route('/login')
  .post(validate(userLoginSchema), handleLogin)

export default router;
