import express from 'express';
import validate from '../middleware/validateResource';
import {
  createShopSchema,
  getShopMenuSchema,
  getShopSchema,
} from '../modules/shop/shop.schema';
import { shopFactory } from '../modules/shop/shop.factory';

const router = express.Router();

router
  .route('/create')
  .post(
    validate(createShopSchema),
    async (req, res) => await shopFactory().createShop(req, res),
  );

router
  .route('/list')
  .get(async (req, res) => await shopFactory().getShops(req, res));

router
  .route('/:id')
  .get(
    validate(getShopSchema),
    async (req, res) => await shopFactory().getShopById(req, res),
  );

router
  .route('/:id/menu')
  .get(
    validate(getShopMenuSchema),
    async (req, res) => await shopFactory().getShopMenu(req, res),
  );

export default router;
