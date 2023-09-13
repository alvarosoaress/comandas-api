import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IUserRepository } from './Iuser.repository';
import {
  type Client,
  type Shop,
  user,
  type User,
  shop,
  client,
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

  async getByEmail(email: string): Promise<Shop | Client | undefined> {
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
        columns: {
          userId: false,
        },
      });

      return shopFound;
    } else {
      const clientFound = await db.query.client.findFirst({
        where: eq(client.userId, userFound.id),
        with: { userInfo: true },
      });

      return clientFound;
    }
  }

  async getById(id: string | number): Promise<Shop | Client | undefined> {
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
        columns: {
          userId: false,
        },
      });

      return shopFound;
    } else {
      const clientFound = await db.query.client.findFirst({
        where: eq(client.userId, userFound.id),
        with: { userInfo: true },
      });

      return clientFound;
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
