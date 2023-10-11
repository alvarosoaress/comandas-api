import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IOrderRepository } from './Iorder.repository';
import {
  type Order,
  customer,
  item,
  order,
  shop,
  qrCode,
  type OrderFormatted,
} from '../../../database/schema';
import {
  type OrderCancelType,
  type OrderCompleteType,
  type OrderCreateType,
} from './order.schema';
import deleteObjKey from '../../utils';

function formatOrder(orders: Order[]): OrderFormatted {
  const newOrderTransformed: OrderFormatted = orders.reduce(
    (result, order) => {
      result.id = order.id;
      result.createdAt = order.createdAt;
      result.updatedAt = order.updatedAt;
      result.shopId = order.shopId;
      result.groupId = order.groupId;
      result.customerId = order.customerId;

      result.items.push({
        itemId: order.itemId,
        quantity: order.quantity,
        total: order.total,
      });

      result.total = order.total;
      result.tableId = order.tableId;
      result.status = order.status;
      result.note = order.note;

      return result;
    },
    {
      id: 0 as number | undefined,
      createdAt: new Date() as Date | undefined,
      updatedAt: new Date() as Date | undefined,
      shopId: 0,
      groupId: 0,
      customerId: 0,
      items: [{ itemId: 0, quantity: 0, total: 0 }],
      total: 0,
      tableId: 0,
      status: 'open' as 'open' | 'closed' | 'cancelled' | undefined,
      note: undefined as string | null | undefined,
    },
  );

  // Forma mais rápida que encontrei para remover o
  // item 0 que vem de default por causa do reduce
  newOrderTransformed.items.shift();

  return newOrderTransformed;
}

export class OrderRepository implements IOrderRepository {
  async exists(shopId: number, tableId: number): Promise<boolean> {
    const orderFound = await db.query.order.findFirst({
      where: and(
        eq(order.shopId, shopId),
        eq(order.tableId, tableId),
        eq(order.status, 'open'),
      ),
    });

    return !!orderFound;
  }

  async existsById(orderId: string): Promise<boolean> {
    const orderFound = await db.query.order.findFirst({
      where: eq(order.groupId, parseInt(orderId)),
    });

    return !!orderFound;
  }

  async shopExists(shopId: number): Promise<boolean> {
    const shopFound = await db.query.shop.findFirst({
      where: eq(shop.userId, shopId),
    });

    return !!shopFound;
  }

  async customerExists(customerId: number): Promise<boolean> {
    const customerFound = await db.query.customer.findFirst({
      where: eq(customer.userId, customerId),
    });

    return !!customerFound;
  }

  async itemExists(itemId: number): Promise<boolean> {
    const itemFound = await db.query.item.findFirst({
      where: eq(item.id, itemId),
    });

    return !!itemFound;
  }

  async tableExists(
    shopId: number,
    tableId: number,
  ): Promise<boolean | undefined> {
    const tablesQuantity = await db.query.shop.findFirst({
      where: eq(shop.userId, shopId),
      columns: { tables: true },
    });

    if (!tablesQuantity) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return tableId <= tablesQuantity.tables!;
  }

  // TODO Ver uma forma do update qrCode ser opcional
  async create(orders: OrderCreateType): Promise<OrderFormatted | undefined> {
    const randomGroupId = Math.floor((Date.now() * Math.random()) / 1000);

    await db.transaction(async (tx) => {
      orders.forEach(async (orderInfo) => {
        await tx.insert(order).values({ ...orderInfo, groupId: randomGroupId });
      });
    });

    const newOrder = await db.query.order.findMany({
      where: eq(order.groupId, randomGroupId),
    });

    const newOrderTransformed = formatOrder(newOrder);

    await db
      .update(qrCode)
      .set({ isOccupied: true, updatedAt: newOrderTransformed.updatedAt })
      .where(
        and(
          eq(qrCode.shopId, newOrderTransformed.shopId),
          eq(qrCode.table, newOrderTransformed.tableId),
        ),
      );

    return newOrderTransformed;
  }

  async getById(orderGroupId: string): Promise<OrderFormatted | undefined> {
    const orderFound = await db.query.order.findMany({
      where: eq(order.groupId, parseInt(orderGroupId)),
    });

    const orderFormatted = formatOrder(orderFound);

    return orderFormatted;
  }

  // TODO Implementar um limit aqui
  async list(): Promise<Order[]> {
    const orders = await db.query.order.findMany();

    return orders;
  }

  // TODO Ver uma forma do update qrCode ser opcional
  async complete(
    orderInfo: OrderCompleteType,
  ): Promise<OrderFormatted | undefined> {
    orderInfo.updatedAt = new Date();

    // Salvando e retirando id
    // para evitar o usuário atualizar o id no BD
    const orderGroupId = orderInfo.groupId;

    deleteObjKey(orderInfo, 'groupId');

    await db
      .update(order)
      .set({ status: 'closed', updatedAt: orderInfo.updatedAt })
      .where(eq(order.groupId, parseInt(orderGroupId)));

    const completedOrder = await db.query.order.findMany({
      where: eq(order.groupId, parseInt(orderGroupId)),
    });

    if (!completedOrder) return undefined;

    const completedOrderFormatted = formatOrder(completedOrder);

    await db
      .update(qrCode)
      .set({ isOccupied: false, updatedAt: orderInfo.updatedAt })
      .where(
        and(
          eq(qrCode.shopId, completedOrderFormatted.shopId),
          eq(qrCode.table, completedOrderFormatted.tableId),
        ),
      );

    return completedOrderFormatted;
  }

  // TODO Ver uma forma do update qrCode ser opcional
  async cancel(
    orderInfo: OrderCancelType,
  ): Promise<OrderFormatted | undefined> {
    orderInfo.updatedAt = new Date();

    // Salvando e retirando id
    // para evitar o usuário atualizar o id no BD
    const orderGroupId = orderInfo.groupId;

    deleteObjKey(orderInfo, 'groupId');

    await db
      .update(order)
      .set({ status: 'cancelled', updatedAt: orderInfo.updatedAt })
      .where(eq(order.groupId, parseInt(orderGroupId)));

    const cancelledOrder = await db.query.order.findMany({
      where: eq(order.groupId, parseInt(orderGroupId)),
    });

    if (!cancelledOrder) return undefined;

    const cancelledOrderFormatted = formatOrder(cancelledOrder);

    await db
      .update(qrCode)
      .set({ isOccupied: false, updatedAt: orderInfo.updatedAt })
      .where(
        and(
          eq(qrCode.shopId, cancelledOrderFormatted.shopId),
          eq(qrCode.table, cancelledOrderFormatted.tableId),
        ),
      );

    return cancelledOrderFormatted;
  }
}
