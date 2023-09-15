import {
  type ShopExtended,
  type Item,
  type ShopExtendedSafe,
  type Shop,
} from '../../../database/schema';
import { type ShopUpdateType, type ShopCreateType } from './shop.schema';

export type IShopRepository = {
  create: (info: ShopCreateType) => Promise<ShopExtendedSafe | undefined>;
  list: () => Promise<ShopExtended[]>;
  getMenu: (userId: string) => Promise<Item[] | undefined>;
  update: (newShopInfo: ShopUpdateType) => Promise<Shop | undefined>;
};
