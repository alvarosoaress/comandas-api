import {
  type User,
  type ClientSafe,
  type ShopSafe,
  type UserSafe,
} from '../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../../helpers/api.erros';
import deleteObjKey from '../../utils';
import { type IUserRepository } from './Iuser.repository';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';
import jwt, { type Secret } from 'jsonwebtoken';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export type UserLoginRes = {
  accessToken: string;
  userInfo: Omit<User, 'password' | 'refreshToken'>;
};

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async create(userInfo: User): Promise<UserSafe> {
    const userExists = await this.userRepository.exists(userInfo.email);

    if (userExists) throw new ConflictError('User already exists');

    const hashPassword = await bcrypt.hash(userInfo.password, 10);

    userInfo.password = hashPassword;

    const newUser = await this.userRepository.create(userInfo);

    deleteObjKey(newUser, 'password');
    deleteObjKey(newUser, 'refreshToken');

    return newUser;
  }

  async list(): Promise<User[]> {
    const userList = await this.userRepository.list();

    if (!userList || userList.length < 1)
      throw new NotFoundError('No users found');

    userList.forEach((user) => {
      deleteObjKey(user, 'password');
      deleteObjKey(user, 'refreshToken');
    });

    return userList;
  }

  async getById(id: string): Promise<ShopSafe | ClientSafe> {
    const userFound = await this.userRepository.getById(id);

    if (!userFound) throw new NotFoundError('No user found');

    deleteObjKey(userFound.userInfo, 'password');
    deleteObjKey(userFound.userInfo, 'refreshToken');

    return userFound;
  }

  async getByEmail(email: string): Promise<ShopSafe | ClientSafe> {
    const userFound = await this.userRepository.getByEmail(email);

    if (!userFound) throw new NotFoundError('No user found');

    deleteObjKey(userFound.userInfo, 'password');
    deleteObjKey(userFound.userInfo, 'refreshToken');

    return userFound;
  }

  async logIn(email: string, password: string): Promise<UserLoginRes> {
    const userFound = await this.userRepository.getByEmail(email);

    if (!userFound) throw new NotFoundError('No user found');

    const matchPassword = await bcrypt.compare(
      password,
      userFound.userInfo.password,
    );

    if (!matchPassword) throw new UnauthorizedError('Credentials do not match');

    const accessToken = jwt.sign(
      {},
      process.env.ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: '1m', subject: String(userFound.userInfo.id) },
    );

    const refreshToken = jwt.sign(
      {},
      process.env.REFRESH_TOKEN_SECRET as Secret,
      { expiresIn: '2m', subject: String(userFound.userInfo.id) },
    );

    userFound.userInfo.refreshToken = refreshToken;

    const refreshTokenRes = await this.userRepository.update(
      userFound.userInfo,
    );

    if (refreshTokenRes < 1) throw new InternalServerError();

    deleteObjKey(userFound.userInfo, 'refreshToken');
    deleteObjKey(userFound.userInfo, 'password');

    return { accessToken, userInfo: userFound.userInfo };
  }

  async updateAccessToken(id: number): Promise<boolean | string> {
    const refreshTokenRes = await this.userRepository.getRefreshToken(id);

    if (!refreshTokenRes) throw new NotFoundError('No user found');

    const refreshTokenVerify = jwt.decode(refreshTokenRes, { json: true });

    const today = new Date().getTime() / 1000;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const diff = refreshTokenVerify!.exp! - today;

    // Se a diff for negativa, o tempo de validade do token expirou
    if (diff < 1) {
      return false;
    } else {
      // Gerar novo Access Token
      const newAccessToken = jwt.sign(
        {},
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: '1m', subject: String(id) },
      );

      return newAccessToken;
    }
  }
}
