import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IUserRepository } from './Iuser.repository';
import {
  type CustomerExtended,
  type ShopExtended,
  user,
  type User,
  shop,
  customer,
} from '../../../database/schema';

export class UserRepository implements IUserRepository {
  async exists(email: string): Promise<boolean> {
    const userExists = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    return !!userExists;
  }

  async list(): Promise<User[]> {
    const users = await db.query.user.findMany();

    return users;
  }

  async create(userInfo: User): Promise<User> {
    const insertReturn = await db.insert(user).values(userInfo);

    const insertId = insertReturn[0].insertId;

    userInfo.id = insertId;

    return userInfo;
  }

  async getByEmail(
    email: string,
  ): Promise<ShopExtended | CustomerExtended | undefined> {
    const userFound = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!userFound) return undefined;

    if (userFound?.role === 'shop') {
      const shopFound = await db.query.shop.findFirst({
        where: eq(shop.userId, userFound.id),
        with: {
          addressInfo: true,
          userInfo: true,
        },
      });

      return shopFound;
    } else {
      const customerFound = await db.query.customer.findFirst({
        where: eq(customer.userId, userFound.id),
        with: { userInfo: true },
      });

      return customerFound;
    }
  }

  async getById(
    id: string | number,
  ): Promise<ShopExtended | CustomerExtended | undefined> {
    const userFound = await db.query.user.findFirst({
      where: eq(user.id, Number(id)),
    });

    if (!userFound) return undefined;

    if (userFound?.role === 'shop') {
      const shopFound = await db.query.shop.findFirst({
        where: eq(shop.userId, userFound.id),
        with: {
          addressInfo: true,
          userInfo: true,
        },
      });

      return shopFound;
    } else {
      const customerFound = await db.query.customer.findFirst({
        where: eq(customer.userId, userFound.id),
        with: { userInfo: true },
      });

      return customerFound;
    }
  }

  async update(newUserInfo: User): Promise<number> {
    const updatedUser = await db
      .update(user)
      .set(newUserInfo)
      .where(eq(user.id, newUserInfo.id as number));

    return updatedUser[0].affectedRows;
  }

  async getRefreshToken(id: number): Promise<string | null | undefined> {
    const response = await db.query.user.findFirst({
      where: eq(user.id, id),
      columns: { refreshToken: true },
    });

    return response?.refreshToken;
  }
}
