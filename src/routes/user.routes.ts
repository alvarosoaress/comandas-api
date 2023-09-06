import express from 'express';
import validate from '../middleware/validateResource';
import {
  createUserSchema,
  getUserByIdSchema,
  userLoginSchema,
} from '../modules/user/user.schema';
import { userFactory } from '../modules/user/user.factory';

const router = express.Router();

router
  .route('/create')
  .post(
    validate(createUserSchema),
    async (req, res) => await userFactory().createUser(req, res),
  );

router
  .route('/list')
  .get(async (req, res) => await userFactory().getUsers(req, res));

router
  .route('/:id')
  .get(
    validate(getUserByIdSchema),
    async (req, res) => await userFactory().getUserById(req, res),
  );

router
  .route('/login')
  .post(
    validate(userLoginSchema),
    async (req, res) => await userFactory().logIn(req, res),
  );

export default router;
