import express from 'express';
import validate from '../middleware/validateResource';
import {
  shopCreateSchema,
  shopGetMenuSchema,
  shopUpdateSchema,
} from '../modules/shop/shop.schema';
import { shopFactory } from '../modules/shop/shop.factory';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router
  .route('/create')
  .post(
    validate(shopCreateSchema),
    async (req, res) => await shopFactory().createShop(req, res),
  );

router
  .route('/list')
  .get(async (req, res) => await shopFactory().getShops(req, res));

router
  .route('/:id/menu')
  .get(
    validate(shopGetMenuSchema),
    async (req, res) => await shopFactory().getShopMenu(req, res),
  );

router
  .route('/update')
  .put(
    verifyToken('shop'),
    validate(shopUpdateSchema),
    async (req, res) => await shopFactory().updateShop(req, res),
  );

export default router;
