/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type createMenuItemType,
  type getMenuItemsType,
} from '../../schema/menuItems.schema';
import { db } from '../../../database';
import { menuItem } from '../../../database/schema';
import { and, eq } from 'drizzle-orm';
import { ConflictError, NotFoundError } from '../../helpers/api.erros';

export async function getMenuItems(
  req: Request<getMenuItemsType>,
  res: Response,
) {
  const { id } = req.params;

  const menuItems = await db.query.menuItem.findMany({
    where: eq(menuItem.shopId, parseInt(id)),
  });

  if (!menuItems || menuItems.length < 1)
    throw new NotFoundError('No items found');

  return res.status(200).json({
    error: false,
    data: menuItems,
  });
}

export async function createMenuItem(
  req: Request<unknown, unknown, createMenuItemType>,
  res: Response,
) {
  const { shopId, categoryId, name, description, price, temperature, vegan } =
    req.body;

  const menuItemExists = await db.query.menuItem.findFirst({
    where: and(eq(menuItem.shopId, shopId), eq(menuItem.name, name)),
  });

  if (menuItemExists != null) throw new ConflictError('Item already exists');

  const newMenuItem = {
    shopId,
    categoryId,
    name,
    description,
    price,
    temperature,
    vegan,
  };

  await db.insert(menuItem).values(newMenuItem);

  return res.status(200).json({
    error: false,
    message: `Item ${name} created`,
    data: newMenuItem,
  });
}
