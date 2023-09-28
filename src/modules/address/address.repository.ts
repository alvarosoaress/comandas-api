import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { address, type Address } from '../../../database/schema';
import {
  type IAddressRepository,
  type AddressExists,
} from './Iaddress.repository';
import { type AddressUpdateType } from './address.schema';
import deleteObjKey from '../../utils';

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

  async existsById(addressId: number): Promise<boolean> {
    const addressExists = await db.query.address.findFirst({
      where: eq(address.id, addressId),
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

  async update(
    newAddressInfo: AddressUpdateType,
  ): Promise<Address | undefined> {
    newAddressInfo.updatedAt = new Date();

    // Salvando e retirando id de newAddressInfo
    // para evitar o usuário atualizar o id no BD
    const addressId = newAddressInfo.id;

    deleteObjKey(newAddressInfo, 'id');

    await db
      .update(address)
      .set(newAddressInfo)
      .where(eq(address.id, addressId));

    const updatedAddress = await db.query.address.findFirst({
      where: eq(address.id, addressId),
    });

    if (!updatedAddress) return undefined;

    return updatedAddress;
  }
}
