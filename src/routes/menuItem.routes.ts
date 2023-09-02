import { Router } from 'express';
import {
  createItem,
  getItems,
  getItem,
} from '../controllers/item/menuItems.controller';
import validate from '../middleware/validateResource';
import { getItemsSchema } from '../schema/menuItems.schema';

const router = Router();

router.route('/:id').post(getItem);

router.route('/list').get(getItems);

router.route('/create').post(validate(getItemsSchema), createItem);

export default router;
