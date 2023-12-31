import { and, eq } from 'drizzle-orm';
import { db } from '../../database';
import {
  item,
  itemCategory,
  order,
  qrCode,
  review,
  shop,
} from '../../database/schema';
import { type ScheduleSetType } from '../modules/schedule/schedule.schema';

type doubleOwnership = {
  customerId?: number | string;
  shopId?: number | string;
};

export function genericOwnership(
  requestId: number | string | undefined,
  operationId: number | string,
): boolean {
  return Number(requestId) === Number(operationId);
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

export function orderGenericDoubleOwnership(
  requesterId: number | string,
  operationId: doubleOwnership,
): boolean {
  return (
    Number(operationId.customerId) === Number(requesterId) ||
    Number(operationId.shopId) === Number(requesterId)
  );
}

export async function orderGenericOwnership(
  requesterId: number,
  orderGroupId: number | string,
): Promise<boolean> {
  const orderFound = await db.query.order.findFirst({
    where: eq(order.groupId, Number(orderGroupId)),
  });

  return (
    orderFound?.shopId === requesterId || orderFound?.customerId === requesterId
  );
}

export async function orderShopOwnership(
  shopId: number,
  orderGroupId: number | string,
): Promise<boolean> {
  const orderFound = await db.query.order.findFirst({
    where: eq(order.groupId, Number(orderGroupId)),
  });

  return orderFound?.shopId === shopId;
}

export async function orderTableShopOwnership(
  shopId: number | string,
  tableId: number | string,
): Promise<boolean> {
  if (shopId === 'admin') return true;

  const orderFound = await db.query.order.findFirst({
    where: and(
      eq(order.shopId, Number(shopId)),
      eq(order.tableId, Number(tableId)),
    ),
  });

  return orderFound ? orderFound?.shopId === shopId : false;
}

export function scheduleShopOwnership(
  shopId: number,
  shopIdArr: ScheduleSetType,
): boolean {
  let shopIdDuplicate = false;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  shopIdArr.forEach(({ shop_id }) => {
    if (shopId !== shop_id) shopIdDuplicate = true;
  });

  return shopIdDuplicate;
}

export async function reviewOwnership(
  requesterId: number | string,
  reviewId: number,
): Promise<boolean> {
  const reviewFound = await db.query.review.findFirst({
    where: eq(review.id, Number(reviewId)),
  });

  return reviewFound?.customerId === requesterId;
}
