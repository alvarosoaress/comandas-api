/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import {
  type QrCodeGetType,
  type QrCodeCreateType,
  type QrCodeDeleteType,
} from './qrCode.schema';
import { type QrCodeService } from './qrCode.service';
import { qrCodeOwnership } from '../../middleware/ownership';
import verifyOwnership from '../../middleware/verifyOwnership';

export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  async getQrCodeById(req: Request<QrCodeGetType>, res: Response) {
    const qrCode = await this.qrCodeService.getById(req.params.id);

    return res.status(200).json(qrCode);
  }

  async listQrCode(req: Request, res: Response) {
    const qrCodes = await this.qrCodeService.list();

    return res.status(200).json(qrCodes);
  }

  async createQrCode(
    req: Request<unknown, unknown, QrCodeCreateType>,
    res: Response,
  ) {
    verifyOwnership(
      await qrCodeOwnership(Number(req.user.id), req.body.shopId),
      req,
    );

    const newQrCode = await this.qrCodeService.create(req.body);

    return res.status(200).json(newQrCode);
  }

  async deleteQrCode(req: Request<QrCodeDeleteType>, res: Response) {
    verifyOwnership(
      await qrCodeOwnership(Number(req.user.id), req.params.id),
      req,
    );

    const deletedQrCode = await this.qrCodeService.delete(req.params.id);

    return res.status(200).json(deletedQrCode);
  }
}
