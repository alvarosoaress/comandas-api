import { type User } from '../../../database/schema';
import { ConflictError, NotFoundError } from '../../helpers/api.erros';
import { type IUserRepository } from './Iuser.repository';

export class UserService {
  constructor(private readonly UserRepository: IUserRepository) {}

  async create(userInfo: User): Promise<User> {
    const userExists = await this.UserRepository.exists(userInfo.email);

    if (userExists) throw new ConflictError('User already exists');

    const newUser = await this.UserRepository.create(userInfo);

    return newUser;
  }

  async getById(id: number): Promise<User> {
    const userFound = await this.UserRepository.getById(id);

    if (!userFound) throw new NotFoundError('No user found');

    return userFound;
  }

  async getByEmail(email: string): Promise<User> {
    const userFound = await this.UserRepository.getByEmail(email);

    if (!userFound) throw new NotFoundError('No user found');

    return userFound;
  }

  async list(): Promise<User[]> {
    const userList = await this.UserRepository.list();

    if (!userList || userList.length < 1)
      throw new NotFoundError('No users found');

    return userList;
  }
}
