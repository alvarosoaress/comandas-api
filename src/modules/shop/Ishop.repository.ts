import {
  type ShopExtended,
  type Item,
  type ShopExtendedSafe,
  type Shop,
} from '../../../database/schema';
import { type createShopType } from './shop.schema';

export type IShopRepository = {
  create: (info: createShopType) => Promise<ShopExtendedSafe | undefined>;
  list: () => Promise<ShopExtended[]>;
  getMenu: (userId: string) => Promise<Item[] | undefined>;
  update: (newShopInfo: Shop) => Promise<Shop | undefined>;
};
