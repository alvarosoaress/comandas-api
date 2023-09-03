/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { type createItemType, type getItemsType } from './item.schema';
import { db } from '../../../database';
import { item } from '../../../database/schema';
import { and, eq } from 'drizzle-orm';
import { ConflictError, NotFoundError } from '../../helpers/api.erros';

export async function getItem(req: Request<getItemsType>, res: Response) {
  const { id } = req.params;

  const itemFound = await db.query.item.findFirst({
    where: eq(item.shopId, parseInt(id)),
  });

  if (!itemFound) throw new NotFoundError('No item found');

  return res.status(200).json({
    error: false,
    data: itemFound,
  });
}

export async function getItems(req: Request, res: Response) {
  const items = await db.query.item.findMany();

  if (!items) throw new NotFoundError('No items found');

  return res.status(200).json({
    error: false,
    data: items,
  });
}

export async function createItem(
  req: Request<unknown, unknown, createItemType>,
  res: Response,
) {
  const { shopId, categoryId, name, description, price, temperature, vegan } =
    req.body;

  const itemExists = await db.query.item.findFirst({
    where: and(eq(item.shopId, shopId), eq(item.name, name)),
  });

  if (itemExists != null) throw new ConflictError('Item already exists');

  const newItem = {
    shopId,
    categoryId,
    name,
    description,
    price,
    temperature,
    vegan,
  };

  await db.insert(item).values(newItem);

  return res.status(200).json({
    error: false,
    message: `Item ${name} created`,
    data: newItem,
  });
}
