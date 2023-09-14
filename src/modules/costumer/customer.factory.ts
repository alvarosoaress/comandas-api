import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { CustomerService } from './customer.service';

export function customerFactory(): CustomerController {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  const customerRepository = new CustomerRepository(userService);
  const customerService = new CustomerService(customerRepository);
  const customerController = new CustomerController(customerService);

  return customerController;
}
