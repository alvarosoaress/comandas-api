import express from 'express';
import validate from '../middleware/validateResource';
import { customerFactory } from '../modules/costumer/customer.factory';
import {
  customerCreateSchema,
  customerUpdateSchema,
} from '../modules/costumer/customer.schema';

const router = express.Router();

router
  .route('/create')
  .post(
    validate(customerCreateSchema),
    async (req, res) => await customerFactory().createCustomer(req, res),
  );

router
  .route('/list')
  .get(async (req, res) => await customerFactory().getCustomers(req, res));

router
  .route('/update')
  .put(
    validate(customerUpdateSchema),
    async (req, res) => await customerFactory().updateCustomer(req, res),
  );

export default router;
