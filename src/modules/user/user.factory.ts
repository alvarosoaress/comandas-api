import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

export function userFactory(): UserController {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  return userController;
}
