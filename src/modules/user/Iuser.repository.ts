import { type User } from '../../../database/schema';

export type IUserRepository = {
  exists: (email: string) => Promise<boolean>;
  create: (userInfo: User) => Promise<User>;
  list: () => Promise<User[]>;
  getByEmail: (email: string) => Promise<User | undefined>;
  getById: (id: string | number) => Promise<User | undefined>;
  update: (newUserInfo: User) => Promise<number>;
  getRefreshToken: (id: number) => Promise<string | null | undefined>;
};
