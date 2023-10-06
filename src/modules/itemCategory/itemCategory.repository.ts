import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IItemCategoryRepository } from './IitemCategory.repository';
import {
  type ItemCategory,
  item,
  itemCategory,
  shop,
} from '../../../database/schema';
import {
  type ItemCategorySetType,
  type ItemCategoryCreateType,
  type ItemCategoryRemoveType,
} from './itemCategory.schema';

export class ItemCategoryRepository implements IItemCategoryRepository {
  async existsById(itemCategoryId: number): Promise<boolean> {
    const itemCategoryFound = await db.query.itemCategory.findFirst({
      where: eq(itemCategory.id, itemCategoryId),
    });

    return !!itemCategoryFound;
  }

  async existsByShop(
    shopId: number,
    itemCategoryName: string,
  ): Promise<boolean> {
    const itemCategoryFound = await db.query.itemCategory.findFirst({
      where: and(
        eq(itemCategory.shopId, shopId),
        eq(itemCategory.name, itemCategoryName),
      ),
    });

    return !!itemCategoryFound;
  }

  async existsItem(itemId: number): Promise<boolean> {
    const itemExists = await db.query.item.findFirst({
      where: eq(item.id, itemId),
    });

    return !!itemExists;
  }

  async existsShop(shopId: number): Promise<boolean> {
    const shopExists = await db.query.shop.findFirst({
      where: eq(shop.userId, shopId),
    });

    return !!shopExists;
  }

  async belongsToShop(
    shopId: number,
    itemCategoryId: number,
  ): Promise<boolean> {
    const item = await db.query.itemCategory.findFirst({
      where: eq(itemCategory.id, itemCategoryId),
    });

    return item?.shopId === shopId;
  }

  async getById(itemCategoryId: string): Promise<ItemCategory | undefined> {
    const itemCategoryFound = await db.query.itemCategory.findFirst({
      where: eq(itemCategory.id, parseInt(itemCategoryId)),
    });

    return itemCategoryFound;
  }

  async getByShop(shopId: number): Promise<ItemCategory[] | undefined> {
    const itemCategoryFound = await db.query.itemCategory.findMany({
      where: eq(itemCategory.shopId, shopId),
    });

    return itemCategoryFound;
  }

  async list(): Promise<ItemCategory[]> {
    const itemsFound = await db.query.itemCategory.findMany();

    return itemsFound;
  }

  async create(
    itemCategoryInfo: ItemCategoryCreateType,
  ): Promise<ItemCategory | undefined> {
    const insertReturn = await db.insert(itemCategory).values(itemCategoryInfo);

    const insertId = insertReturn[0].insertId;

    const newItemCategory = await db.query.itemCategory.findFirst({
      where: eq(itemCategory.id, insertId),
    });

    return newItemCategory;
  }

  async set(setInfo: ItemCategorySetType): Promise<ItemCategory | undefined> {
    await db
      .update(item)
      .set({ categoryId: setInfo.itemCategoryId })
      .where(eq(item.id, setInfo.itemId));

    const setReturn = await db.query.itemCategory.findFirst({
      where: eq(itemCategory.id, setInfo.itemCategoryId),
    });

    return setReturn;
  }

  async remove(
    removeInfo: ItemCategoryRemoveType,
  ): Promise<ItemCategory | undefined> {
    await db
      .update(item)
      .set({ categoryId: null })
      .where(eq(item.id, removeInfo.itemId));

    const removeReturn = await db.query.itemCategory.findFirst({
      where: eq(itemCategory.id, removeInfo.itemCategoryId),
    });

    return removeReturn;
  }
}
