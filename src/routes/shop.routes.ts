import express from 'express';
import validate from '../middleware/validateResource';
import { createShopSchema, getShopSchema } from '../schema/shop.schema';
import {
  createShop,
  getShop,
  getShops,
} from '../controllers/shop/shop.controller';

const router = express.Router();

router.route('/create').patch(validate(createShopSchema), createShop);

router.route('/list').get(getShops);

router.route('/:id').get(validate(getShopSchema), getShop);

export default router;
