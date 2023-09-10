import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type Item, item, user } from '../../../database/schema';
import { type IItemRepository } from './Iitem.repository';
import deleteObjKey from '../../utils';

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

  async update(newItemInfo: Item): Promise<Item | undefined> {
    // O atributo createdAt é reconhecido como String
    // mas o drizzle não consegue passar para date para o mysql
    // então é preciso tratar o objeto antes
    deleteObjKey(newItemInfo, 'createdAt');

    await db
      .update(item)
      .set(newItemInfo)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .where(eq(item.id, newItemInfo.id!));

    const updatedItem = await db.query.item.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      where: eq(item.id, newItemInfo.id!),
    });

    return updatedItem;
  }
}
