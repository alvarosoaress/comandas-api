import express from 'express';
import validate from '../middleware/validateResource';
import { createShopSchema } from '../schema/shop.schema';
import { createShop, getShops } from '../controllers/shop/shop.controller';

const router = express.Router();

router.route('/create')
  .patch(validate(createShopSchema), createShop)

router.route('/list')
  .get(getShops)

export default router;
