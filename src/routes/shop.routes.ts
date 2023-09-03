import express from 'express';
import validate from '../middleware/validateResource';
import { createShopSchema, getShopSchema } from '../modules/shop/shop.schema';
import { createShop, getShop, getShops } from '../modules/shop/shop.controller';

const router = express.Router();

router.route('/create').patch(validate(createShopSchema), createShop);

router.route('/list').get(getShops);

router.route('/:id').get(validate(getShopSchema), getShop);

export default router;
