/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { address } from '../../../database/schema';
import { ConflictError, NotFoundError } from '../../helpers/api.erros';
import { type Request, type Response } from 'express';
import {
  type getAddressType,
  type createAddressType,
} from '../../schema/address.schema';

export async function getAddresses(req: Request, res: Response) {
  const addresses = await db.query.address.findMany();

  if (!addresses) throw new NotFoundError('No addresses found');

  return res.status(200).json({
    error: false,
    data: addresses,
  });
}

export async function getAddress(req: Request<getAddressType>, res: Response) {
  const { id } = req.params;

  const addressFound = await db.query.user.findFirst({
    where: eq(address.id, parseInt(id)),
  });

  if (!addressFound) throw new NotFoundError('No address found');

  return res.status(200).json({
    error: false,
    data: addressFound,
  });
}

export async function createAddress(
  req: Request<unknown, unknown, createAddressType>,
  res: Response,
) {
  const {
    street,
    number,
    neighborhood,
    city,
    state,
    country,
    zipcode,
    lat,
    long,
  } = req.body;

  const addressExists = await db.query.address.findFirst({
    where: and(
      eq(address.street, street),
      eq(address.number, number),
      eq(address.neighborhood, neighborhood),
      eq(address.city, city),
    ),
  });

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
    long,
  };

  const insertReturn = await db.insert(address).values(newAddress);

  const insertId = insertReturn[0].insertId;

  return res.status(200).json({
    error: false,
    message: 'Address created',
    data: { ...newAddress, id: insertId },
  });
}
