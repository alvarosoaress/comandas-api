import { type Address } from '../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../helpers/api.erros';
import { type IAddressRepository } from './Iaddress.repository';
import { type AddressUpdateType } from './address.schema';

export class AddressService {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async create(addressInfo: Address): Promise<Address> {
    const addressExists = await this.addressRepository.exists({
      number: addressInfo.number,
      street: addressInfo.street,
      neighborhood: addressInfo.neighborhood,
      city: addressInfo.city,
      state: addressInfo.state,
      country: addressInfo.country,
    });

    if (addressExists) throw new ConflictError('Address already exists');

    const newAddress = await this.addressRepository.create(addressInfo);

    return newAddress;
  }

  async list(): Promise<Address[]> {
    const addressList = await this.addressRepository.list();

    if (!addressList || addressList.length < 1)
      throw new NotFoundError('No addresses found');

    return addressList;
  }

  async getById(id: number): Promise<Address | null> {
    const addressFound = await this.addressRepository.getById(id);

    if (!addressFound) throw new NotFoundError('No address found');

    return addressFound;
  }

  async update(
    newAddressInfo: AddressUpdateType,
  ): Promise<Address | undefined> {
    const addressExists = await this.addressRepository.existsById(
      newAddressInfo.id,
    );

    if (!addressExists) throw new NotFoundError('Address not found exists');

    const addressUpdated = await this.addressRepository.update(newAddressInfo);

    if (!addressUpdated) throw new InternalServerError();

    return addressUpdated;
  }
}
