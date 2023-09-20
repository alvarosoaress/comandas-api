import { and, eq, sql } from 'drizzle-orm';
import { db } from '../../../database';
import deleteObjKey from '../../utils';
import { type IGeneralCategoryRepository } from './IgeneralCategory.repository';
import {
  type GeneralCategory,
  generalCategory,
  shop,
  shopCategory,
} from '../../../database/schema';
import {
  type GeneralCategoryUpdateType,
  type GeneralCategoryCreateType,
  type GeneralCategorySetType,
  type GeneralCategoryShopType,
} from './generalCategory.schema';

export class GeneralCategoryRepository implements IGeneralCategoryRepository {
  async existsByName(name: string): Promise<boolean> {
    const categoryFound = await db.query.generalCategory.findFirst({
      where: eq(generalCategory.name, name),
    });

    return !!categoryFound;
  }

  async existsById(id: number): Promise<boolean> {
    const categoryFound = await db.query.generalCategory.findFirst({
      where: eq(generalCategory.id, id),
    });

    return !!categoryFound;
  }

  async create(
    generalCategoryInfo: GeneralCategoryCreateType,
  ): Promise<GeneralCategory | undefined> {
    const insertReturn = await db
      .insert(generalCategory)
      .values(generalCategoryInfo);

    const insertId = insertReturn[0].insertId;

    const newGeneralCategory = await db.query.generalCategory.findFirst({
      where: eq(generalCategory.id, insertId),
    });

    return newGeneralCategory;
  }

  async getById(id: string): Promise<GeneralCategory | undefined> {
    const categoryFound = await db.query.generalCategory.findFirst({
      where: eq(generalCategory.id, parseInt(id)),
    });

    return categoryFound;
  }

  async list(): Promise<GeneralCategory[]> {
    const items = await db.query.generalCategory.findMany();

    return items;
  }

  async update(
    newCategoryInfo: GeneralCategoryUpdateType,
  ): Promise<GeneralCategory | undefined> {
    newCategoryInfo.updatedAt = new Date();

    // Salvando e retirando id
    // para evitar o usuário atualizar o id no BD
    const cateogryId = newCategoryInfo.id as number;

    deleteObjKey(newCategoryInfo, 'id');

    await db
      .update(generalCategory)
      .set(newCategoryInfo)
      .where(eq(generalCategory.id, cateogryId));

    const updatedCategory = await db.query.generalCategory.findFirst({
      where: eq(generalCategory.id, cateogryId),
    });

    return updatedCategory;
  }

  async delete(id: string): Promise<GeneralCategory | undefined> {
    const category = await db.query.generalCategory.findFirst({
      where: eq(generalCategory.id, parseInt(id)),
    });

    await db.execute(
      sql`DELETE FROM ${shopCategory} WHERE ${
        shopCategory.generalCategoryId
      } = ${parseInt(id)};`,
    );

    const deleted = await db
      .delete(generalCategory)
      .where(eq(generalCategory.id, parseInt(id)));

    if (deleted[0].affectedRows >= 1) return category;

    return undefined;
  }

  async shopExists(shopId: number): Promise<boolean> {
    const shopFound = await db.query.shop.findFirst({
      where: eq(shop.userId, shopId),
    });

    return !!shopFound;
  }

  async generalCategoryRelationExists(
    shopId: number,
    generalCategoryId: number,
  ): Promise<boolean> {
    const relatoinExists = await db.query.shopCategory.findFirst({
      where: and(
        eq(shopCategory.shopId, shopId),
        eq(shopCategory.generalCategoryId, generalCategoryId),
      ),
    });

    return !!relatoinExists;
  }

  async getShopListCategories(
    shopId: string,
  ): Promise<GeneralCategoryShopType | undefined> {
    const shopCategories = await db.query.shopCategory.findMany({
      columns: {},
      where: and(eq(shopCategory.shopId, parseInt(shopId))),
      with: { categories: { columns: { name: true, id: true } } },
    });

    if (!shopCategories) return undefined;

    const shopCategoriesTretead = shopCategories.map((cat) => {
      return {
        name: cat.categories.name,
        id: cat.categories.id,
      };
    });

    return shopCategoriesTretead;
  }

  async set(
    categorySetInfo: GeneralCategorySetType,
  ): Promise<GeneralCategoryShopType | undefined> {
    await db.transaction(async (tx) => {
      categorySetInfo.generalCategoryId.forEach(async (category) => {
        await tx.insert(shopCategory).values({
          shopId: categorySetInfo.shopId,
          generalCategoryId: category,
        });
      });
    });

    const settledCategories = await db.query.shopCategory.findMany({
      columns: {},
      where: and(eq(shopCategory.shopId, categorySetInfo.shopId)),
      with: { categories: { columns: { name: true, id: true } } },
    });

    if (!settledCategories) return undefined;

    const settledCategoriesTretead = settledCategories.map((cat) => {
      return {
        name: cat.categories.name,
        id: cat.categories.id,
      };
    });

    return settledCategoriesTretead;
  }

  async remove(
    categorySetInfo: GeneralCategorySetType,
  ): Promise<GeneralCategoryShopType | undefined> {
    await db.transaction(async (tx) => {
      categorySetInfo.generalCategoryId.forEach(async (category) => {
        await db.execute(
          sql`DELETE FROM ${shopCategory} WHERE ${shopCategory.shopId} = ${categorySetInfo.shopId} AND ${shopCategory.generalCategoryId}  = ${category};`,
        );
      });
    });

    const remainingCategories = await db.query.shopCategory.findMany({
      columns: {},
      where: and(eq(shopCategory.shopId, categorySetInfo.shopId)),
      with: { categories: { columns: { name: true, id: true } } },
    });

    if (!remainingCategories) return undefined;

    const remainingCategoriesTretead = remainingCategories.map((cat) => {
      return {
        name: cat.categories.name,
        id: cat.categories.id,
      };
    });

    return remainingCategoriesTretead;
  }
}
