import { type QrCode } from '../../../database/schema';
import { ConflictError, NotFoundError } from '../../helpers/api.erros';
import { type IQrCodeRepository } from './IqrCode.repository';
import { type QrCodeCreateType } from './qrCode.schema';

export class QrCodeService {
  constructor(private readonly qrCodeRepository: IQrCodeRepository) {}

  async getById(qrCodeId: string): Promise<QrCode | undefined> {
    const qrCodeExists = await this.qrCodeRepository.exists(parseInt(qrCodeId));

    if (!qrCodeExists) throw new NotFoundError('QrCode not found');

    const qrCodeFound = await this.qrCodeRepository.getById(qrCodeId);

    return qrCodeFound;
  }

  async list(): Promise<QrCode[]> {
    const qrCodes = await this.qrCodeRepository.list();

    if (!qrCodes || qrCodes.length <= 0)
      throw new NotFoundError('No Qr Codes found');

    return qrCodes;
  }

  async create(qrCodeInfo: QrCodeCreateType): Promise<QrCode | undefined> {
    const shopExists = await this.qrCodeRepository.existsShop(
      qrCodeInfo.shopId,
    );

    if (!shopExists) throw new NotFoundError('Shop not exists');

    const qrCodeExists = await this.qrCodeRepository.existsByTable(
      qrCodeInfo.shopId,
      qrCodeInfo.table,
    );

    if (qrCodeExists) throw new ConflictError('QrCode already exists');

    const qrCodeSize = '350';
    const qrCodeColor = 'F3484F';

    const newQrCodeUrl = `https://image-charts.com/chart?chs=${qrCodeSize}x${qrCodeSize}&cht=qr&choe=UTF-8&icqrf=${qrCodeColor}&chld=M&chof=.png&chl={"shopId":${qrCodeInfo.shopId},"table":${qrCodeInfo.table}}`;

    const newQrCodeInfo: QrCode = {
      shopId: qrCodeInfo.shopId,
      table: qrCodeInfo.table,
      qrCodeUrl: newQrCodeUrl,
    };

    const newQrCode = await this.qrCodeRepository.create(newQrCodeInfo);

    return newQrCode;
  }

  async delete(qrCodeId: string): Promise<QrCode | undefined> {
    const qrCodeExists = await this.qrCodeRepository.exists(parseInt(qrCodeId));

    if (!qrCodeExists) throw new NotFoundError('QrCode not found');

    const qrCodeDeleted = await this.qrCodeRepository.delete(qrCodeId);

    return qrCodeDeleted;
  }
}
