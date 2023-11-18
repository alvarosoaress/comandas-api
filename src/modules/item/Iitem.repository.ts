import { type Item } from '../../../database/schema';
import { type ItemUpdateType } from './item.schema';

export type IItemRepository = {
  exists: (shopId: number, name: string) => Promise<boolean>;
  existsById: (itemId: number) => Promise<boolean>;
  shopExists: (shopId: number) => Promise<boolean>;
  itemCategoryExists: (itemCategoryId: number) => Promise<boolean>;
  create: (itemInfo: Item) => Promise<Item | undefined>;
  getById: (itemId: string) => Promise<Item | undefined>;
  list: () => Promise<Item[]>;
  update: (newItemInfo: ItemUpdateType) => Promise<Item | undefined>;
  delete: (itemId: number) => Promise<Item | undefined>;
};
