/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import {
  type UserLoginType,
  type UserGetByIdType,
  type UserGetByEmailType,
  type UserUpdateAccessTokenType,
  type UserUpdateType,
} from './user.schema';
import { type UserService } from './user.service';

dotenv.config({ path: path.resolve('./.env') });

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getUsers(req: Request, res: Response) {
    const users = await this.userService.list();

    return res.status(200).json(users);
  }

  async getUserById(req: Request<UserGetByIdType>, res: Response) {
    const userFound = await this.userService.getById(req.params.id);

    return res.status(200).json(userFound);
  }

  async getUserByEmail(req: Request<UserGetByEmailType>, res: Response) {
    const userFound = await this.userService.getByEmail(req.params.email);

    return res.status(200).json(userFound);
  }

  async logIn(req: Request<unknown, unknown, UserLoginType>, res: Response) {
    const userInfo = await this.userService.logIn(
      req.body.email,
      req.body.password,
    );

    return res.status(200).json({ ...userInfo });
  }

  async updateAccessToken(
    req: Request<unknown, unknown, UserUpdateAccessTokenType>,
    res: Response,
  ) {
    const newAccessToken = await this.userService.updateAccessToken(
      req.body.id,
    );

    return res.status(200).json(newAccessToken);
  }

  async updateUser(
    req: Request<unknown, unknown, UserUpdateType>,
    res: Response,
  ) {
    const updatedUser = await this.userService.update(req.body);

    return res.status(200).json(updatedUser);
  }
}
