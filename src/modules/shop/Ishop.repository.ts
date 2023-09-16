import {
  type ShopExtended,
  type Item,
  type ShopExtendedSafe,
  type Shop,
  type ShopWithCategories,
} from '../../../database/schema';
import { type ShopUpdateType, type ShopCreateType } from './shop.schema';

export type IShopRepository = {
  create: (info: ShopCreateType) => Promise<ShopExtendedSafe | undefined>;
  list: () => Promise<ShopExtended[]>;
  getMenu: (userId: string) => Promise<Item[] | undefined>;
  existsGeneralCategory: (generalCategoryId: number) => Promise<boolean>;
  update: (
    newShopInfo: ShopUpdateType,
  ) => Promise<Shop | ShopWithCategories | undefined>;
};
