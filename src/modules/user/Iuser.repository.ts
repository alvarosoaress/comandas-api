import {
  type CustomerExtended,
  type ShopExtended,
  type User,
} from '../../../database/schema';
import { type UserUpdateType } from './user.schema';

export type IUserRepository = {
  exists: (email: string) => Promise<boolean>;
  existsById: (id: number) => Promise<boolean>;
  create: (userInfo: User) => Promise<User>;
  list: () => Promise<User[]>;
  getByEmail: (
    email: string,
  ) => Promise<ShopExtended | CustomerExtended | undefined>;
  getById: (
    id: string | number,
  ) => Promise<ShopExtended | CustomerExtended | undefined>;
  getRefreshToken: (id: number) => Promise<string | null | undefined>;
  updateRefreshToken: (newUserInfo: User) => Promise<number>;
  update: (newUserInfo: UserUpdateType) => Promise<User | undefined>;
};
