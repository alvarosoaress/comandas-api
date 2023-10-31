import { eq } from 'drizzle-orm';
import { db } from '../../database';
import {
  type Item,
  item,
  type Order,
  type OrderFormatted,
  shop,
  customer,
  type ShopExtended,
  type CustomerExtended,
} from '../../database/schema';

export function deleteObjKey<
  T extends Record<string, unknown>,
  K extends keyof T,
>(object: T, key: K): void {
  // delete object[key] serve para alterar o object passado
  // sem criar uma nova referência dele
  // ou seja, a função muta o object passado
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete object[key];
}

export async function formatOrder(
  orders: Order[],
): Promise<Promise<OrderFormatted>> {
  const itemsId = new Set(orders.map((item) => item.itemId));

  const itemsInfo: Item[] = [];

  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  await db.transaction(async (tx) => {
    Array.from(itemsId).map(async (id) => {
      itemsInfo.push(
        (await tx.query.item.findFirst({
          where: eq(item.id, id),
        })) as unknown as Item,
      );
    });
  });

  const shopFound = (await db.query.shop.findFirst({
    where: eq(shop.userId, orders[0].shopId),
    with: { userInfo: true, addressInfo: true },
  })) as unknown as ShopExtended;

  deleteObjKey(shopFound.userInfo, 'refreshToken');
  deleteObjKey(shopFound.userInfo, 'password');

  const customerFound = (await db.query.customer.findFirst({
    where: eq(customer.userId, orders[0].customerId),
    with: { userInfo: true },
  })) as unknown as CustomerExtended;

  deleteObjKey(customerFound.userInfo, 'refreshToken');
  deleteObjKey(customerFound.userInfo, 'password');

  const newOrderTransformed: OrderFormatted = orders.reduce(
    (result, order, index) => {
      result.id = order.id;
      result.createdAt = order.createdAt;
      result.updatedAt = order.updatedAt;
      result.shop = shopFound;
      result.groupId = order.groupId;
      result.customer = customerFound;

      result.items.push({
        ...itemsInfo[index],
        quantity: order.quantity,
        total: order.total,
      });

      result.total += order.total;
      result.tableId = order.tableId;
      result.status = order.status;
      result.note = order.note;

      return result;
    },
    {
      id: 0 as number | undefined,
      createdAt: new Date() as Date | undefined,
      updatedAt: new Date() as Date | undefined,
      // TODO TROCAR ESSE ANY AQUI
      // FAZER UM ZOD SCHEMA PARA ShopOrderExtended
      shop: undefined as any,
      groupId: 0,
      // TODO TROCAR ESSE ANY AQUI
      customer: undefined as any,
      items: new Array<Item & { quantity: number; total: number }>(),
      total: 0,
      tableId: 0,
      status: 'open' as 'open' | 'closed' | 'cancelled' | undefined,
      note: undefined as string | null | undefined,
    },
  );

  return newOrderTransformed;
}
