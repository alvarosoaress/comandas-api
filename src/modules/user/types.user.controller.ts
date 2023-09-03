import { type NewUser } from '../../../database/schema';

export type Res = {
  error: boolean;
  message?: string;
};

export type GetUsersRes = {
  data?: Array<Omit<NewUser, 'password'>>;
} & Res;

export type CreateUserRes = {
  data?: {
    name: string;
    email: string;
    phoneNumber?: number | null | undefined;
  };
} & Res;

export type LoggedUser = Omit<NewUser, 'password'>;

export type HandleLoginRes = {
  accessToken?: string;
  data?: LoggedUser;
  newUser?: NewUser;
} & Res;
