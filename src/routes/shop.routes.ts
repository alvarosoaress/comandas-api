import express from 'express';
import validate from '../middleware/validateResource';
import {
  shopCreateSchema,
  shopGetItemCategorySchema,
  shopGetMenuSchema,
  shopGetOrderSchema,
  shopGetQrCodeSchema,
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
  .route('/:id/qrcode')
  .get(
    validate(shopGetQrCodeSchema),
    async (req, res) => await shopFactory().getShopQrCodes(req, res),
  );

router
  .route('/:id/itemcategory')
  .get(
    validate(shopGetItemCategorySchema),
    async (req, res) => await shopFactory().getShopItemCategories(req, res),
  );

router
  .route('/:id/order')
  .get(
    verifyToken('shop'),
    validate(shopGetOrderSchema),
    async (req, res) => await shopFactory().getShopOrders(req, res),
  );

router
  .route('/:id/schedule')
  .get(
    validate(shopGetOrderSchema),
    async (req, res) => await shopFactory().getShopSchedule(req, res),
  );

router
  .route('/update')
  .put(
    verifyToken('shop'),
    validate(shopUpdateSchema),
    async (req, res) => await shopFactory().updateShop(req, res),
  );

export default router;
