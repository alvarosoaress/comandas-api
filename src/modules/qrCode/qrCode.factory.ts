import { QrCodeController } from './qrCode.controller';
import { QrCodeRepository } from './qrCode.repository';
import { QrCodeService } from './qrCode.service';

export function qrCodeFactory(): QrCodeController {
  const qrCodeRepository = new QrCodeRepository();
  const qrCodeService = new QrCodeService(qrCodeRepository);
  const qrCodeController = new QrCodeController(qrCodeService);
  return qrCodeController;
}
