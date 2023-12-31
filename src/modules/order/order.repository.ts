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
import { deleteObjKey, formatOrder } from '../../utils';
import { BadRequestError } from '../../helpers/api.erros';

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
      // Verificando se há items em estoque
      // Se tiver, atualiza o número disponível em estoque
      for (const orderItem of orders) {
        const itemInStock = await tx.query.item.findFirst({
          where: eq(item.id, orderItem.itemId),
          columns: { quantity: true },
        });

        if (
          !itemInStock ||
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          itemInStock.quantity! <= 0 ||
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          itemInStock.quantity! < orderItem.quantity
        )
          throw new BadRequestError(
            `Item ${orderItem.itemId} has no stock, requested stock: ${orderItem.quantity},curent item stock: ${itemInStock?.quantity}`,
          );

        // Mudando item para "Não disponível" caso o pedido atual vá zerar o seu estoque
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (itemInStock.quantity! - orderItem.quantity === 0) {
          await tx
            .update(item)
            .set({
              quantity: 0,
              available: false,
            })
            .where(eq(item.id, orderItem.itemId));
        } else {
          await tx
            .update(item)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .set({ quantity: itemInStock.quantity! - orderItem.quantity })
            .where(eq(item.id, orderItem.itemId));
        }
      }

      orders.forEach(async (orderInfo) => {
        await tx.insert(order).values({ ...orderInfo, groupId: randomGroupId });
      });
    });

    const newOrder = await db.query.order.findMany({
      where: eq(order.groupId, randomGroupId),
    });

    const newOrderTransformed = await formatOrder(newOrder);

    await db
      .update(qrCode)
      .set({ isOccupied: true, updatedAt: newOrderTransformed.updatedAt })
      .where(
        and(
          eq(qrCode.shopId, newOrderTransformed.shop.userId),
          eq(qrCode.table, newOrderTransformed.tableId),
        ),
      );

    return newOrderTransformed;
  }

  async getById(orderGroupId: string): Promise<OrderFormatted | undefined> {
    const orderFound = await db.query.order.findMany({
      where: eq(order.groupId, parseInt(orderGroupId)),
    });

    const orderFormatted = await formatOrder(orderFound);

    return orderFormatted;
  }

  async getByTable(
    tableId: string,
    shopId: string,
  ): Promise<OrderFormatted | undefined> {
    const orderFound = await db.query.order.findMany({
      where: and(
        eq(order.shopId, parseInt(shopId)),
        eq(order.tableId, parseInt(tableId)),
        eq(order.status, 'open'),
      ),
    });

    if (!orderFound || orderFound.length <= 0) return undefined;

    const orderFormatted = await formatOrder(orderFound);

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

    const completedOrderFormatted = await formatOrder(completedOrder);

    await db
      .update(qrCode)
      .set({ isOccupied: false, updatedAt: orderInfo.updatedAt })
      .where(
        and(
          eq(qrCode.shopId, completedOrderFormatted.shop.userId),
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

    const cancelledOrderFormatted = await formatOrder(cancelledOrder);

    await db
      .update(qrCode)
      .set({ isOccupied: false, updatedAt: orderInfo.updatedAt })
      .where(
        and(
          eq(qrCode.shopId, cancelledOrderFormatted.shop.userId),
          eq(qrCode.table, cancelledOrderFormatted.tableId),
        ),
      );

    return cancelledOrderFormatted;
  }
}
