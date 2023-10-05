import { and, eq } from 'drizzle-orm';
import { db } from '../../../database';
import { type IQrCodeRepository } from './IqrCode.repository';
import { type QrCode, qrCode, shop } from '../../../database/schema';

export class QrCodeRepository implements IQrCodeRepository {
  async exists(qrCodeId: number): Promise<boolean> {
    const qrCodeFound = await db.query.qrCode.findFirst({
      where: eq(qrCode.id, qrCodeId),
    });

    return !!qrCodeFound;
  }

  async existsShop(shopId: number): Promise<boolean> {
    const shopFound = await db.query.shop.findFirst({
      where: eq(shop.userId, shopId),
    });

    return !!shopFound;
  }

  async existsByTable(shopId: number, table: number): Promise<boolean> {
    const qrCodeFound = await db.query.qrCode.findFirst({
      where: and(eq(qrCode.shopId, shopId), eq(qrCode.table, table)),
    });

    return !!qrCodeFound;
  }

  async getById(qrCodeId: string): Promise<QrCode | undefined> {
    const qrCodeFound = await db.query.qrCode.findFirst({
      where: eq(qrCode.id, parseInt(qrCodeId)),
    });

    return qrCodeFound;
  }

  async list(): Promise<QrCode[]> {
    const qrCodes = await db.query.qrCode.findMany();

    return qrCodes;
  }

  async create(qrCodeInfo: QrCode): Promise<QrCode | undefined> {
    const insertReturn = await db.insert(qrCode).values(qrCodeInfo);

    const insertId = insertReturn[0].insertId;

    const newQrCode = await db.query.qrCode.findFirst({
      where: eq(qrCode.id, insertId),
    });

    return newQrCode;
  }

  async delete(qrCodeId: string): Promise<QrCode | undefined> {
    const qrCodeInfo = await db.query.qrCode.findFirst({
      where: eq(qrCode.id, parseInt(qrCodeId)),
    });

    await db.delete(qrCode).where(eq(qrCode.id, parseInt(qrCodeId)));

    return qrCodeInfo;
  }
}
