/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type OrderGetType,
  type OrderCreateType,
  type OrderCompleteType,
  type OrderCancelType,
} from './order.schema';
import { type OrderService } from './order.service';
import verifyOwnership from '../../middleware/verifyOwnership';
import {
  orderGenericDoubleOwnership,
  orderGenericOwnership,
  orderShopOwnership,
} from '../../middleware/ownership';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async createOrder(
    req: Request<unknown, unknown, OrderCreateType>,
    res: Response,
  ) {
    verifyOwnership(
      orderGenericDoubleOwnership(Number(req.user.id), {
        customerId: req.body[0].customerId,
        shopId: req.body[0].shopId,
      }),
      req,
    );

    const newOrder = await this.orderService.create(req.body);

    return res.status(200).json(newOrder);
  }

  async getOrders(req: Request, res: Response) {
    const orders = await this.orderService.list();

    return res.status(200).json(orders);
  }

  async getOrderById(req: Request<OrderGetType>, res: Response) {
    verifyOwnership(
      await orderGenericOwnership(Number(req.user.id), req.params.groupId),
      req,
    );

    const orderFound = await this.orderService.getById(req.params.groupId);

    return res.status(200).json(orderFound);
  }

  async completeOrder(req: Request<OrderCompleteType>, res: Response) {
    verifyOwnership(
      await orderShopOwnership(Number(req.user.id), req.params.groupId),
      req,
    );

    const orderCompleted = await this.orderService.completeOrder(req.params);

    return res.status(200).json(orderCompleted);
  }

  async cancelOrder(req: Request<OrderCancelType>, res: Response) {
    verifyOwnership(
      await orderGenericOwnership(Number(req.user.id), req.params.groupId),
      req,
    );

    const orderCancelled = await this.orderService.cancelOrder(req.params);

    return res.status(200).json(orderCancelled);
  }
}
