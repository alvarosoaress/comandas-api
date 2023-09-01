import express from 'express';
import validate from '../middleware/validateResource';
import { createAddressSchema } from '../schema/address.schema';
import { createAddress, getAddresses } from '../controllers/address/address.controller';

const router = express.Router();

router.route('/create')
  .post(validate(createAddressSchema), createAddress)

router.route('/list')
  .get(getAddresses)

export default router;
