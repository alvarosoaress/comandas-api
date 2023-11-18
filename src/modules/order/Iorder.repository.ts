import { type OrderFormatted, type Order } from '../../../database/schema';
import {
  type OrderCreateType,
  type OrderCompleteType,
  type OrderCancelType,
} from './order.schema';

export type IOrderRepository = {
  exists: (shopId: number, tableId: number) => Promise<boolean>;
  existsById: (groupId: string) => Promise<boolean>;
  shopExists: (shopId: number) => Promise<boolean>;
  customerExists: (customerId: number) => Promise<boolean>;
  itemExists: (itemId: number) => Promise<boolean>;
  tableExists: (
    shopId: number,
    tableId: number,
  ) => Promise<boolean | undefined>;
  create: (orderInfo: OrderCreateType) => Promise<OrderFormatted | undefined>;
  getById: (orderGroupId: string) => Promise<OrderFormatted | undefined>;
  getByTable: (orderTable: string) => Promise<OrderFormatted | undefined>;
  list: () => Promise<Order[]>;
  complete: (
    orderInfo: OrderCompleteType,
  ) => Promise<OrderFormatted | undefined>;
  cancel: (rderInfo: OrderCancelType) => Promise<OrderFormatted | undefined>;
};
