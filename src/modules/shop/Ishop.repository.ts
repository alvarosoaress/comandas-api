import {
  type Shop,
  type Address,
  type User,
  type Item,
  type ShopSafe,
} from '../../../database/schema';

export type IShopRepository = {
  create: (
    userInfo: User,
    addressInfo: Address,
  ) => Promise<ShopSafe | undefined>;
  list: () => Promise<Shop[]>;
  getMenu: (userId: string) => Promise<Item[] | undefined>;
};
