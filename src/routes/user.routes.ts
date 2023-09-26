import express from 'express';
import validate from '../middleware/validateResource';
import {
  userGetByIdSchema,
  userUpdateAccessSchema,
  userLoginSchema,
  userUpdateSchema,
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

router
  .route('/update')
  .put(
    validate(userUpdateSchema),
    async (req, res) => await userFactory().updateUser(req, res),
  );

export default router;
