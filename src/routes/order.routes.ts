import { Router } from 'express';
import validate from '../middleware/validateResource';
import verifyToken from '../middleware/verifyToken';
import {
  orderCancelSchema,
  orderCompleteSchema,
  orderCreateSchema,
} from '../modules/order/order.schema';
import { orderFactory } from '../modules/order/order.factory';

const router = Router();

router
  .route('/create')
  .post(
    verifyToken('both'),
    validate(orderCreateSchema),
    async (req, res) => await orderFactory().createOrder(req, res),
  );

router
  .route('/list')
  .get(
    verifyToken('admin'),
    async (req, res) => await orderFactory().getOrders(req, res),
  );

router
  .route('/:groupId')
  .get(
    verifyToken('both'),
    async (req, res) => await orderFactory().getOrderById(req, res),
  );

router
  .route('/table/:tableId')
  .get(
    verifyToken('both'),
    async (req, res) => await orderFactory().getOrderByTable(req, res),
  );

router
  .route('/complete/:groupId')
  .post(
    verifyToken('both'),
    validate(orderCompleteSchema),
    async (req, res) => await orderFactory().completeOrder(req, res),
  );

router
  .route('/cancel/:groupId')
  .delete(
    verifyToken('both'),
    validate(orderCancelSchema),
    async (req, res) => await orderFactory().cancelOrder(req, res),
  );

export default router;
