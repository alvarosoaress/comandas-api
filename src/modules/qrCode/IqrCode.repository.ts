import { type QrCode } from '../../../database/schema';

export type IQrCodeRepository = {
  exists: (qrCodeId: number) => Promise<boolean>;
  existsShop: (shopId: number) => Promise<boolean>;
  existsByTable: (shopId: number, table: number) => Promise<boolean>;
  getById: (qrCodeId: string) => Promise<QrCode | undefined>;
  list: () => Promise<QrCode[]>;
  create: (qrCodeInfo: QrCode) => Promise<QrCode | undefined>;
  delete: (qrCodeId: string) => Promise<QrCode | undefined>;
};
