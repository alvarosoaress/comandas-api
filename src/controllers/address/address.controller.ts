/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { address } from '../../../database/schema';
import { ConflictError, NotFoundError } from '../../helpers/api.erros';
import { type Request, type Response } from 'express';
import { type createAddressType } from '../../schema/address.schema';

export async function getAddresses (req: Request, res: Response) {
  const addresses = await db.query.address.findMany();

  if (addresses === null) throw new NotFoundError('No addresses found')

  return res.status(200).json({
    error: false,
    addresses
  });
};

export async function createAddress (req: Request<unknown, unknown, createAddressType>, res: Response) {
  const { street, number, neighborhood, city, state, country, zipcode, lat, long } = req.body;

  const addressExists = await db.query.address.findFirst({
    where:
        and(
          eq(address.street, street),
          eq(address.number, number),
          eq(address.neighborhood, neighborhood),
          eq(address.city, city)
        )
  })

  if (addressExists != null) throw new ConflictError('Address already exists');

  const newAddress = {
    street,
    number,
    neighborhood,
    city,
    state,
    country,
    zipcode,
    lat,
    long
  };

  await db.insert(address).values(newAddress);

  return res.status(200).json({
    error: false,
    message: 'Address created',
    newAddress
  });
};
