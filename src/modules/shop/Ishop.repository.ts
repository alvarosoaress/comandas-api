import {
  type Item,
  type ShopExtendedSafe,
  type Shop,
  type QrCode,
  type ItemCategory,
  type OrderFormatted,
} from '../../../database/schema';
import {
  type ShopUpdateType,
  type ShopCreateType,
  type ShopListType,
} from './shop.schema';

export type IShopRepository = {
  exists: (userId: number) => Promise<boolean>;
  create: (info: ShopCreateType) => Promise<ShopExtendedSafe | undefined>;
  list: (query?: ShopListType) => Promise<any>;
  getMenu: (userId: string) => Promise<Item[] | undefined>;
  getQrCodes: (userId: string) => Promise<QrCode[] | undefined>;
  getOrders: (userId: string) => Promise<OrderFormatted[] | undefined>;
  getItemCategories: (userId: string) => Promise<ItemCategory[] | undefined>;
  update: (newShopInfo: ShopUpdateType) => Promise<Shop | undefined>;
};
