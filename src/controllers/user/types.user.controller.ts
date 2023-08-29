import { type NewUser } from '../../../database/schema';

export type Res = {
  error: boolean
  message?: string
}

export type GetUsersRes = {
  users?: Array<Omit<NewUser, 'password'>>
} & Res;

export type CreateUserRes = {
  newUser?: {
    name: string
    email: string
    phoneNumber?: number | null | undefined
  }
} & Res;

export type LoggedUser = Omit<NewUser, 'password'>

export type HandleLoginRes = {
  accessToken?: string
  userInfo?: LoggedUser
  newUser?: NewUser
} & Res;
