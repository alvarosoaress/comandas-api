import {
  type Item,
  type ShopExtendedSafe,
  type Shop,
  type QrCode,
  type ItemCategory,
  type OrderFormatted,
  type ShopSchedule,
} from '../../../database/schema';
import {
  type ShopUpdateType,
  type ShopCreateType,
  type ShopListType,
  type ShopListResType,
} from './shop.schema';

export type IShopRepository = {
  exists: (userId: number) => Promise<boolean>;
  create: (info: ShopCreateType) => Promise<ShopExtendedSafe | undefined>;
  list: (query?: ShopListType) => Promise<ShopListResType[]>;
  getMenu: (userId: string) => Promise<Item[] | undefined>;
  getQrCodes: (userId: string) => Promise<QrCode[] | undefined>;
  getOrders: (userId: string) => Promise<OrderFormatted[] | undefined>;
  getItemCategories: (userId: string) => Promise<ItemCategory[] | undefined>;
  getSchedule: (userId: string) => Promise<ShopSchedule[] | undefined>;
  update: (newShopInfo: ShopUpdateType) => Promise<Shop | undefined>;
};
