import express from 'express';
import validate from '../middleware/validateResource';
import {
  addressCreateSchema,
  addressGetSchema,
} from '../modules/address/address.schema';
import { addressFactory } from '../modules/address/address.factory';

const router = express.Router();

router
  .route('/create')
  .post(
    validate(addressCreateSchema),
    async (req, res) => await addressFactory().createAddress(req, res),
  );

router
  .route('/list')
  .get(async (req, res) => await addressFactory().getAddresses(req, res));

router
  .route('/:id')
  .get(
    validate(addressGetSchema),
    async (req, res) => await addressFactory().getAddressById(req, res),
  );

export default router;
