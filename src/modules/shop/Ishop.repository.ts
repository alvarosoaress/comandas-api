import {
  type Item,
  type ShopExtendedSafe,
  type Shop,
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
  update: (newShopInfo: ShopUpdateType) => Promise<Shop | undefined>;
};
