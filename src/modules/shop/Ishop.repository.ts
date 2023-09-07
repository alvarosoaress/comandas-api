import { type ShopMenu, type Shop } from '../../../database/schema';

export type IShopRepository = {
  exists: (userId: number) => Promise<boolean>;
  existsAddress: (addressId: number) => Promise<boolean>;
  create: (userId: number, addressId: number) => Promise<Shop | undefined>;
  getById: (userId: string) => Promise<Shop | undefined>;
  list: () => Promise<Shop[]>;
  getMenu: (userId: string) => Promise<ShopMenu | undefined>;
};
