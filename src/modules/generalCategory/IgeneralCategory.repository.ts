import { type GeneralCategory } from '../../../database/schema';
import {
  type GeneralCategoryUpdateType,
  type GeneralCategoryCreateType,
  type GeneralCategorySetType,
  type GeneralCategoryShopType,
} from './generalCategory.schema';

export type IGeneralCategoryRepository = {
  existsByName: (name: string) => Promise<boolean>;
  existsById: (id: number) => Promise<boolean>;
  create: (
    generalCategoryInfo: GeneralCategoryCreateType,
  ) => Promise<GeneralCategory | undefined>;
  list: () => Promise<GeneralCategory[]>;
  getById: (id: string) => Promise<GeneralCategory | undefined>;
  update: (
    newItemInfo: GeneralCategoryUpdateType,
  ) => Promise<GeneralCategory | undefined>;
  delete: (id: string) => Promise<GeneralCategory | undefined>;
  shopExists: (shopId: number) => Promise<boolean>;
  generalCategoryRelationExists: (
    shopId: number,
    generalCategoryId: number,
  ) => Promise<boolean>;
  set: (
    categorySetInfo: GeneralCategorySetType,
  ) => Promise<GeneralCategoryShopType | undefined>;
  remove: (
    categorySetInfo: GeneralCategorySetType,
  ) => Promise<GeneralCategoryShopType | undefined>;
  getShopListCategories: (
    shopId: string,
  ) => Promise<GeneralCategoryShopType | undefined>;
};
