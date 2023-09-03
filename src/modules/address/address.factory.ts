import { AddressController } from './address.controller';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';

export function addressFactory(): AddressController {
  const addressRepository = new AddressRepository();
  const addressService = new AddressService(addressRepository);
  const addressController = new AddressController(addressService);
  return addressController;
}
