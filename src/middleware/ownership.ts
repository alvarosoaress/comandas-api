import { eq } from 'drizzle-orm';
import { db } from '../../database';
import { item, itemCategory, qrCode, shop } from '../../database/schema';

export function genericOwnership(
  requestId: number,
  operationId: number,
): boolean {
  return requestId === operationId;
}

export async function addressOwnership(
  shopId: number,
  addressId: number | string,
): Promise<boolean> {
  const shopFound = await db.query.shop.findFirst({
    where: eq(shop.userId, shopId),
  });

  return shopFound?.addressId === Number(addressId);
}

export async function itemOwnership(
  shopId: number,
  itemId: number | string,
): Promise<boolean> {
  const itemFound = await db.query.item.findFirst({
    where: eq(item.id, Number(itemId)),
  });

  return itemFound?.shopId === shopId;
}

export async function itemCategoryOwnership(
  shopId: number,
  itemCategoryId: number | string,
): Promise<boolean> {
  const itemCategoryFound = await db.query.itemCategory.findFirst({
    where: eq(itemCategory.id, Number(itemCategoryId)),
  });

  return itemCategoryFound?.shopId === shopId;
}

export async function qrCodeOwnership(
  shopId: number,
  qrCodeId: number | string,
): Promise<boolean> {
  const qrCodeFound = await db.query.qrCode.findFirst({
    where: eq(qrCode.id, Number(qrCodeId)),
  });

  return qrCodeFound?.shopId === shopId;
}
