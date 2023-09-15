import express from 'express';
import validate from '../middleware/validateResource';
import {
  userGetByIdSchema,
  userUpdateAccessSchema,
  userLoginSchema,
} from '../modules/user/user.schema';
import { userFactory } from '../modules/user/user.factory';

const router = express.Router();

router
  .route('/list')
  .get(async (req, res) => await userFactory().getUsers(req, res));

router
  .route('/:id')
  .get(
    validate(userGetByIdSchema),
    async (req, res) => await userFactory().getUserById(req, res),
  );

router
  .route('/login')
  .post(
    validate(userLoginSchema),
    async (req, res) => await userFactory().logIn(req, res),
  );

router
  .route('/updateToken')
  .post(
    validate(userUpdateAccessSchema),
    async (req, res) => await userFactory().updateAccessToken(req, res),
  );

export default router;
