import express from 'express';
import validate from '../middleware/validateResource';
import verifyToken from '../middleware/verifyToken';
import { qrCodeFactory } from '../modules/qrCode/qrCode.factory';
import { qrCodeCreateSchema } from '../modules/qrCode/qrCode.schema';

const router = express.Router();

router
  .route('/list')
  .get(
    verifyToken('shop'),
    async (req, res) => await qrCodeFactory().listQrCode(req, res),
  );

router
  .route('/:id')
  .get(
    verifyToken('shop'),
    async (req, res) => await qrCodeFactory().getQrCodeById(req, res),
  );

router
  .route('/create')
  .post(
    verifyToken('shop'),
    validate(qrCodeCreateSchema),
    async (req, res) => await qrCodeFactory().createQrCode(req, res),
  );

router
  .route('/delete/:id')
  .delete(
    verifyToken('shop'),
    async (req, res) => await qrCodeFactory().deleteQrCode(req, res),
  );

export default router;
