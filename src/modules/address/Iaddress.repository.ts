import { type Address } from '../../../database/schema';
import { type AddressUpdateType } from './address.schema';

export type AddressExists = {
  number: number;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
};

export type IAddressRepository = {
  exists: (info: AddressExists) => Promise<boolean>;
  existsById: (addressId: number) => Promise<boolean>;
  create: (newAddress: Address) => Promise<Address>;
  list: () => Promise<Address[]>;
  getById: (id: number) => Promise<Address | undefined>;
  update: (newAddressInfo: AddressUpdateType) => Promise<Address | undefined>;
};
