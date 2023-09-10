import { type Item } from '../../../database/schema';

export type IItemRepository = {
  exists: (shopId: number, name: string) => Promise<boolean>;
  shopExists: (shopId: number) => Promise<boolean>;
  create: (itemInfo: Item) => Promise<Item | undefined>;
  getById: (itemId: string) => Promise<Item | undefined>;
  list: () => Promise<Item[]>;
  update: (newItemInfo: Item) => Promise<Item | undefined>;
};
