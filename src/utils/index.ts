import { type Order, type OrderFormatted } from '../../database/schema';

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

export function formatOrder(orders: Order[]): OrderFormatted {
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
