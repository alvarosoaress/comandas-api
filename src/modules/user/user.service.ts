import {
  type User,
  type CustomerExtendedSafe,
  type ShopExtendedSafe,
  type UserSafe,
  type CustomerExtended,
  type ShopExtended,
} from '../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../../helpers/api.erros';
import { deleteObjKey } from '../../utils';
import { type IUserRepository } from './Iuser.repository';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';
import jwt, { type Secret } from 'jsonwebtoken';
import { type UserUpdateType } from './user.schema';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export type UserLoginRes = {
  accessToken: string;
  userInfo: Omit<User, 'password' | 'refreshToken'>;
};

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async exists(userEmail: string): Promise<boolean> {
    const userExists = await this.userRepository.exists(userEmail);

    if (userExists) throw new ConflictError('User already exists');

    return userExists;
  }

  async create(userInfo: User): Promise<UserSafe | undefined> {
    const userExists = await this.userRepository.exists(userInfo.email);

    if (userExists) throw new ConflictError('User already exists');

    const hashPassword = await bcrypt.hash(userInfo.password, 10);

    userInfo.password = hashPassword;

    const newUser = await this.userRepository.create(userInfo);

    deleteObjKey(newUser, 'password');
    deleteObjKey(newUser, 'refreshToken');

    return newUser;
  }

  async list(): Promise<UserSafe[]> {
    const userList = await this.userRepository.list();

    if (!userList || userList.length < 1)
      throw new NotFoundError('No users found');

    userList.forEach((user) => {
      deleteObjKey(user, 'password');
      deleteObjKey(user, 'refreshToken');
    });

    return userList;
  }

  async getById(id: string): Promise<ShopExtendedSafe | CustomerExtendedSafe> {
    const userFound = await this.userRepository.getById(id);

    if (!userFound) throw new NotFoundError('No user found');

    deleteObjKey(userFound.userInfo, 'password');
    deleteObjKey(userFound.userInfo, 'refreshToken');

    return userFound;
  }

  async getByEmail(
    email: string,
  ): Promise<ShopExtendedSafe | CustomerExtendedSafe> {
    const userFound = await this.userRepository.getByEmail(email);

    if (!userFound) throw new NotFoundError('No user found');

    deleteObjKey(userFound.userInfo, 'password');
    deleteObjKey(userFound.userInfo, 'refreshToken');

    return userFound;
  }

  async logIn(email: string, password: string): Promise<UserLoginRes> {
    let userFound = await this.userRepository.getByEmail(email);

    if (!userFound) throw new NotFoundError('No user found');

    const matchPassword = await bcrypt.compare(
      password,
      userFound.userInfo.password,
    );

    if (!matchPassword) throw new UnauthorizedError('Credentials do not match');

    const accessToken = jwt.sign(
      { role: userFound.userInfo.role },
      process.env.ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: '10m', subject: String(userFound.userInfo.id) },
    );

    const refreshToken = jwt.sign(
      { role: userFound.userInfo.role },
      process.env.REFRESH_TOKEN_SECRET as Secret,
      { expiresIn: '20m', subject: String(userFound.userInfo.id) },
    );

    userFound.userInfo.refreshToken = refreshToken;

    const refreshTokenRes = await this.userRepository.updateRefreshToken(
      userFound.userInfo,
    );

    if (refreshTokenRes < 1) throw new InternalServerError();

    deleteObjKey(userFound.userInfo, 'refreshToken');
    deleteObjKey(userFound.userInfo, 'password');

    if (userFound.userInfo.role === 'customer') {
      userFound = userFound as CustomerExtended;

      const userInfo = {
        ...userFound.userInfo,
        photoUrl: userFound.photoUrl,
        birthday: userFound.birthday,
      };

      return { accessToken, userInfo };
    } else {
      userFound = userFound as ShopExtended;

      const userInfo = {
        ...userFound.userInfo,
        photoUrl: userFound.photoUrl,
      };

      return { accessToken, userInfo };
    }
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
      throw new UnauthorizedError('Refresh token expried');
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

  async update(newUserInfo: UserUpdateType): Promise<UserSafe | undefined> {
    const userExists = await this.userRepository.existsById(newUserInfo.id);

    if (!userExists) throw new NotFoundError('User not found');

    const userUpdated = await this.userRepository.update(newUserInfo);

    if (!userUpdated) throw new InternalServerError();

    deleteObjKey(userUpdated, 'refreshToken');
    deleteObjKey(userUpdated, 'password');

    return userUpdated;
  }
}
