import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type Item, item, user, itemCategory } from '../../../database/schema';
import { type IItemRepository } from './Iitem.repository';
import { deleteObjKey } from '../../utils';
import { type ItemUpdateType } from './item.schema';

export class ItemRepository implements IItemRepository {
  async exists(itemId: number): Promise<boolean> {
    const itemFound = await db.query.item.findFirst({
      where: eq(item.id, itemId),
    });

    return !!itemFound;
  }

  async shopExists(shopId: number): Promise<boolean> {
    const shopFound = await db.query.user.findFirst({
      where: and(eq(user.id, shopId), eq(user.role, 'shop')),
    });

    return !!shopFound;
  }

  async itemCategoryExists(itemCategoryId: number): Promise<boolean> {
    const itemCategoryFound = await db.query.itemCategory.findFirst({
      where: and(eq(itemCategory.id, itemCategoryId)),
    });

    return !!itemCategoryFound;
  }

  async create(itemInfo: Item): Promise<Item | undefined> {
    const insertReturn = await db.insert(item).values(itemInfo);

    const insertId = insertReturn[0].insertId;

    itemInfo.id = insertId;

    return itemInfo;
  }

  async getById(itemId: string): Promise<Item | undefined> {
    const itemFound = await db.query.item.findFirst({
      where: eq(item.id, parseInt(itemId)),
    });

    return itemFound;
  }

  async list(): Promise<Item[]> {
    const items = await db.query.item.findMany();

    return items;
  }

  async update(newItemInfo: ItemUpdateType): Promise<Item | undefined> {
    newItemInfo.updatedAt = new Date();

    // Salvando e retirando id e shopId de newItemInfo
    // para evitar o usuário atualizar o id e o shopId do item no BD
    const itemId = newItemInfo.id;

    deleteObjKey(newItemInfo, 'id');

    await db.update(item).set(newItemInfo).where(eq(item.id, itemId));

    const updatedItem = await db.query.item.findFirst({
      where: eq(item.id, itemId),
    });

    return updatedItem;
  }
}
