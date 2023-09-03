import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { address, type Address } from '../../../database/schema';
import {
  type IAddressRepository,
  type AddressExists,
} from './Iaddress.repository';

export class AddressRepository implements IAddressRepository {
  async exists(info: AddressExists): Promise<boolean> {
    const addressExists = await db.query.address.findFirst({
      where: and(
        eq(address.number, info.number),
        eq(address.street, info.street),
        eq(address.neighborhood, info.neighborhood),
        eq(address.city, info.city),
        eq(address.state, info.state),
        eq(address.country, info.country),
      ),
    });

    return !!addressExists;
  }

  async create(newAddress: Address): Promise<Address> {
    const insertReturn = await db.insert(address).values(newAddress);

    const insertId = insertReturn[0].insertId;

    newAddress.id = insertId;

    return newAddress;
  }

  async list(): Promise<Address[]> {
    const addressList = await db.query.address.findMany();

    return addressList;
  }

  async getById(id: number): Promise<Address | undefined> {
    const addressFound = await db.query.address.findFirst({
      where: eq(address.id, id),
    });

    return addressFound;
  }
}
