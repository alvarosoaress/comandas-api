import { type ItemCategory } from '../../../database/schema';
import {
  type ItemCategorySetType,
  type ItemCategoryCreateType,
  type ItemCategoryRemoveType,
} from './itemCategory.schema';

export type IItemCategoryRepository = {
  existsById: (itemCategoryId: number) => Promise<boolean>;
  existsByShop: (shopId: number, itemCategoryName: string) => Promise<boolean>;
  existsItem: (itemId: number) => Promise<boolean>;
  existsShop: (shopId: number) => Promise<boolean>;
  belongsToShop: (shopId: number, itemCategoryId: number) => Promise<boolean>;
  create: (
    itemCategoryInfo: ItemCategoryCreateType,
  ) => Promise<ItemCategory | undefined>;
  list: () => Promise<ItemCategory[]>;
  getById: (itemCategoryId: string) => Promise<ItemCategory | undefined>;
  getByShop: (shopId: number) => Promise<ItemCategory[] | undefined>;
  set: (setInfo: ItemCategorySetType) => Promise<ItemCategory | undefined>;
  remove: (
    removeInfo: ItemCategoryRemoveType,
  ) => Promise<ItemCategory | undefined>;
};
