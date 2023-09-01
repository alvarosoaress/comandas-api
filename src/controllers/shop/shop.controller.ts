/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import { address, user } from '../../../database/schema';
import { ConflictError, NotFoundError } from '../../helpers/api.erros';
import { type Request, type Response } from 'express';
import { type createShopType } from '../../schema/shop.schema';

export async function getShops (req: Request, res: Response) {
  const shops = await db.query.user.findMany({ where: eq(user.role, 'shop') });

  if (shops === null) throw new NotFoundError('No shops found')

  return res.status(200).json({
    error: false,
    shops
  });
};

export async function createShop (req: Request<unknown, unknown, createShopType>, res: Response) {
  const { userId, addressId } = req.body;

  const addressFound = await db.query.address.findFirst({ where: eq(address.id, addressId) })
  if (addressFound === null) throw new ConflictError('Address not found');

  const userFound = await db.query.user.findFirst({ where: eq(user.id, userId) })
  if (userFound === null) throw new NotFoundError('User not found');

  await db.update(user).set({ role: 'shop' }).where(eq(user.id, userId))
  await db.update(user).set({ addressId }).where(eq(user.id, userId))

  return res.status(200).json({
    error: false,
    message: 'Shop created'
  });
};
