import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IUserRepository } from './Iuser.repository';
import { user, type User } from '../../../database/schema';

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

  async getByEmail(email: string): Promise<User | undefined> {
    const userFound = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    return userFound;
  }

  async getById(id: number): Promise<User | undefined> {
    const userFound = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    return userFound;
  }
}
