import { type Client, type Shop, type User } from '../../../database/schema';

export type IUserRepository = {
  exists: (email: string) => Promise<boolean>;
  create: (userInfo: User) => Promise<User>;
  list: () => Promise<User[]>;
  getByEmail: (email: string) => Promise<Shop | Client | undefined>;
  getById: (id: string | number) => Promise<Shop | Client | undefined>;
  getRefreshToken: (id: number) => Promise<string | null | undefined>;
  update: (newUserInfo: User) => Promise<number>;
};
