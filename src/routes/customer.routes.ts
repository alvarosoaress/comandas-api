import express from 'express';
import validate from '../middleware/validateResource';
import { customerFactory } from '../modules/customer/customer.factory';
import {
  customerCreateSchema,
  customerGetOrderSchema,
  customerUpdateSchema,
} from '../modules/customer/customer.schema';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router
  .route('/create')
  .post(
    validate(customerCreateSchema),
    async (req, res) => await customerFactory().createCustomer(req, res),
  );

router
  .route('/:id/order')
  .get(
    verifyToken('customer'),
    validate(customerGetOrderSchema),
    async (req, res) => await customerFactory().getCustomerOrders(req, res),
  );

router
  .route('/list')
  .get(
    verifyToken('admin'),
    async (req, res) => await customerFactory().getCustomers(req, res),
  );

router
  .route('/update')
  .put(
    verifyToken('customer'),
    validate(customerUpdateSchema),
    async (req, res) => await customerFactory().updateCustomer(req, res),
  );

export default router;
