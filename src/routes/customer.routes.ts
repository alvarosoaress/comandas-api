import express from 'express';
import validate from '../middleware/validateResource';
import { customerFactory } from '../modules/costumer/customer.factory';
import {
  createCustomerSchema,
  getCustomerSchema,
  updateCustomerSchema,
} from '../modules/costumer/customer.schema';

const router = express.Router();

router
  .route('/create')
  .post(
    validate(createCustomerSchema),
    async (req, res) => await customerFactory().createCustomer(req, res),
  );

router
  .route('/list')
  .get(
    validate(getCustomerSchema),
    async (req, res) => await customerFactory().getCustomers(req, res),
  );

router
  .route('/update')
  .put(
    validate(updateCustomerSchema),
    async (req, res) => await customerFactory().updateCustomer(req, res),
  );

export default router;
