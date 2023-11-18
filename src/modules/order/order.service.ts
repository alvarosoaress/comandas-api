import { type OrderFormatted, type Order } from '../../../database/schema';
import { ConflictError, NotFoundError } from '../../helpers/api.erros';
import { type IOrderRepository } from './Iorder.repository';
import { type OrderCompleteType, type OrderCreateType } from './order.schema';

export class OrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async create(
    orderInfo: OrderCreateType,
  ): Promise<OrderFormatted | undefined> {
    for (const order of orderInfo) {
      const orderExists = await this.orderRepository.exists(
        order.shopId,
        order.tableId,
      );

      if (orderExists)
        throw new ConflictError(
          `Order for this table id ${order.tableId} already exists`,
        );

      const shopExists = await this.orderRepository.shopExists(order.shopId);

      if (!shopExists)
        throw new NotFoundError(`Shop ${order.shopId} not found`);

      const customerExists = await this.orderRepository.customerExists(
        order.customerId,
      );

      if (!customerExists)
        throw new NotFoundError(`Customer ${order.customerId} not found`);

      const itemExists = await this.orderRepository.itemExists(order.itemId);

      if (!itemExists)
        throw new NotFoundError(`Item ${order.itemId} not found`);

      const tableExists = await this.orderRepository.tableExists(
        order.shopId,
        order.tableId,
      );

      if (!tableExists)
        throw new NotFoundError(`Table ${order.tableId} not found`);
    }

    const newOrder = await this.orderRepository.create(orderInfo);

    return newOrder;
  }

  async list(): Promise<Order[]> {
    const orders = await this.orderRepository.list();

    if (!orders || orders.length <= 0)
      throw new NotFoundError('No orders found');

    return orders;
  }

  async getById(groupId: string): Promise<OrderFormatted | undefined> {
    const orderExists = await this.orderRepository.existsById(groupId);

    if (!orderExists) throw new NotFoundError('Order not found');

    const orderFound = await this.orderRepository.getById(groupId);

    return orderFound;
  }

  async getByTable(
    tableId: string,
    shopId: string,
  ): Promise<OrderFormatted | undefined> {
    const shopExists = await this.orderRepository.shopExists(Number(shopId));

    if (!shopExists) throw new NotFoundError('Shop not found');

    const orderFound = await this.orderRepository.getByTable(tableId, shopId);

    if (!orderFound) throw new NotFoundError('Table has no orders');

    return orderFound;
  }

  async completeOrder(
    completedOrderInfo: OrderCompleteType,
  ): Promise<OrderFormatted | undefined> {
    const orderExists = await this.orderRepository.existsById(
      completedOrderInfo.groupId,
    );

    if (!orderExists) throw new NotFoundError('Order not found');

    const completedOrder =
      await this.orderRepository.complete(completedOrderInfo);

    return completedOrder;
  }

  async cancelOrder(
    cancelOrderInfo: OrderCompleteType,
  ): Promise<OrderFormatted | undefined> {
    const orderExists = await this.orderRepository.existsById(
      cancelOrderInfo.groupId,
    );

    if (!orderExists) throw new NotFoundError('Order not found');

    const cancelledOrder = await this.orderRepository.cancel(cancelOrderInfo);

    return cancelledOrder;
  }
}
