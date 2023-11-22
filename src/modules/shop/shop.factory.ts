import { AddressRepository } from '../address/address.repository';
import { AddressService } from '../address/address.service';
import { QrCodeRepository } from '../qrCode/qrCode.repository';
import { QrCodeService } from '../qrCode/qrCode.service';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { ShopController } from './shop.controller';
import { ShopRepository } from './shop.repository';
import { ShopService } from './shop.service';

export function shopFactory(): ShopController {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  const qrCodeRepository = new QrCodeRepository();
  const qrCodeService = new QrCodeService(qrCodeRepository);

  const addressRepository = new AddressRepository();
  const addressService = new AddressService(addressRepository);

  const shopRepository = new ShopRepository(addressService, userService);
  const shopService = new ShopService(shopRepository, qrCodeService);
  const shopController = new ShopController(shopService);

  return shopController;
}
