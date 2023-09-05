/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import {
  type userLoginType,
  type createUserType,
  type getUserByIdType,
  type getUserByEmailType,
} from './user.schema';
import { type UserService } from './user.service';

dotenv.config({ path: path.resolve('./.env') });

export class UserController {
  constructor(private readonly userService: UserService) {}

  async createUser(
    req: Request<unknown, unknown, createUserType>,
    res: Response,
  ) {
    const newUser = await this.userService.create(req.body);

    return res.status(200).json({
      error: false,
      data: newUser,
    });
  }

  async getUsers(req: Request, res: Response) {
    const users = await this.userService.list();

    return res.status(200).json({
      error: false,
      data: users,
    });
  }

  async getUserById(req: Request<getUserByIdType>, res: Response) {
    const userFound = await this.userService.getById(req.params.id);

    return res.status(200).json({
      error: false,
      data: userFound,
    });
  }

  async getUserByEmail(req: Request<getUserByEmailType>, res: Response) {
    const userFound = await this.userService.getByEmail(req.params.email);

    return res.status(200).json({
      error: false,
      data: userFound,
    });
  }

  async logIn(req: Request<unknown, unknown, userLoginType>, res: Response) {
    const userInfo = await this.userService.logIn(
      req.body.email,
      req.body.password,
    );

    return res.status(200).json({
      error: false,
      data: { ...userInfo },
    });
  }
}
