import express from 'express';
import validate from '../middleware/validateResource';
import {
  addressCreateSchema,
  addressGetSchema,
  addressUpdateSchema,
} from '../modules/address/address.schema';
import { addressFactory } from '../modules/address/address.factory';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router
  .route('/create')
  .post(
    validate(addressCreateSchema),
    async (req, res) => await addressFactory().createAddress(req, res),
  );

router
  .route('/list')
  .get(
    verifyToken('admin'),
    async (req, res) => await addressFactory().getAddresses(req, res),
  );

router
  .route('/:id')
  .get(
    verifyToken('shop'),
    validate(addressGetSchema),
    async (req, res) => await addressFactory().getAddressById(req, res),
  );

router
  .route('/update')
  .put(
    verifyToken('shop'),
    validate(addressUpdateSchema),
    async (req, res) => await addressFactory().updateAddress(req, res),
  );

export default router;
