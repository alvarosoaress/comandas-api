import express from 'express';
import validate from '../middleware/validateResource';
import { createShopSchema, getShopByIdSchema } from '../schema/shop.schema';
import { createShop, getShopById, getShops } from '../controllers/shop/shop.controller';

const router = express.Router();

router.route('/create')
  .patch(validate(createShopSchema), createShop)

router.route('/list')
  .get(getShops)

router.route('/:id')
  .get(validate(getShopByIdSchema), getShopById)

export default router;
