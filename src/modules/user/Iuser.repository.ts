import { type User } from '../../../database/schema';

export type IUserRepository = {
  exists: (email: string) => Promise<boolean>;
  create: (userInfo: User) => Promise<User>;
  list: () => Promise<User[]>;
  getByEmail: (email: string) => Promise<User | undefined>;
  getById: (id: number) => Promise<User | undefined>;
};
