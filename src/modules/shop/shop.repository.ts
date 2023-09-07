import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IShopRepository } from './Ishop.repository';
import {
  user,
  address,
  type Shop,
  type ShopMenu,
} from '../../../database/schema';

export class ShopRepository implements IShopRepository {
  async exists(userId: number): Promise<boolean> {
    const shopExists = await db.query.user.findFirst({
      where: and(eq(user.id, userId), eq(user.role, 'shop')),
    });

    return !!shopExists;
  }

  async existsAddress(addressId: number): Promise<boolean> {
    const addressExists = await db.query.address.findFirst({
      where: eq(address.id, addressId),
    });

    return !!addressExists;
  }

  async create(userId: number, addressId: number): Promise<Shop | undefined> {
    await db
      .update(user)
      .set({ role: 'shop', addressId })
      .where(eq(user.id, userId));

    const newShop = await db.query.user.findFirst({
      where: eq(user.id, userId),
      with: { address: true },
    });

    return newShop;
  }

  async getById(userId: string): Promise<Shop | undefined> {
    const shopFound = await db.query.user.findFirst({
      where: eq(user.id, parseInt(userId)),
      with: {
        address: true,
      },
    });

    return shopFound;
  }

  async list(): Promise<Shop[]> {
    const shops = await db.query.user.findMany({
      where: eq(user.role, 'shop'),
      with: {
        address: true,
      },
    });

    return shops;
  }

  async getMenu(userId: string): Promise<ShopMenu | undefined> {
    const shopMenu = await db.query.user.findFirst({
      where: eq(user.id, parseInt(userId)),
      columns: { id: true, name: true },
      with: {
        items: true,
      },
    });

    return shopMenu;
  }
}
