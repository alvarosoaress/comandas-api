import { AddressRepository } from '../address/address.repository';
import { AddressService } from '../address/address.service';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { ShopController } from './shop.controller';
import { ShopRepository } from './shop.repository';
import { ShopService } from './shop.service';

export function shopFactory(): ShopController {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  const addressRepository = new AddressRepository();
  const addressService = new AddressService(addressRepository);

  const shopRepository = new ShopRepository(addressService, userService);
  const shopService = new ShopService(shopRepository);
  const shopController = new ShopController(shopService);

  return shopController;
}
