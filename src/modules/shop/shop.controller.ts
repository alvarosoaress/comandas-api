/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { address, user } from '../../../database/schema';
import { ConflictError, NotFoundError } from '../../helpers/api.erros';
import { type Request, type Response } from 'express';
import { type getShopType, type createShopType } from './shop.schema';

export async function getShops(req: Request, res: Response) {
  const shops = await db.query.user.findMany({ where: eq(user.role, 'shop') });

  if (!shops || shops.length < 1) throw new NotFoundError('No shops found');

  return res.status(200).json({
    error: false,
    data: shops,
  });
}

export async function getShop(req: Request<getShopType>, res: Response) {
  const { id } = req.params;

  const shopFound = await db.query.user.findFirst({
    where: and(eq(user.id, parseInt(id)), eq(user.role, 'shop')),
    columns: { password: false },
    with: { address: true },
  });

  if (!shopFound) throw new NotFoundError('No shop found');

  return res.status(200).json({
    error: false,
    data: shopFound,
  });
}

export async function createShop(
  req: Request<unknown, unknown, createShopType>,
  res: Response,
) {
  const { userId, addressId } = req.body;

  const addressFound = await db.query.address.findFirst({
    where: eq(address.id, addressId),
  });
  if (!addressFound) throw new ConflictError('Address not found');

  const userFound = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });
  if (!userFound) throw new NotFoundError('User not found');

  await db.update(user).set({ role: 'shop' }).where(eq(user.id, userId));
  await db.update(user).set({ addressId }).where(eq(user.id, userId));

  return res.status(200).json({
    error: false,
    message: 'Shop created',
  });
}
