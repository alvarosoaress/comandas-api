import { Router } from 'express';
import { createItem, getItems, getItem } from '../modules/item/item.controller';
import validate from '../middleware/validateResource';
import { getItemsSchema } from '../modules/item/item.schema';

const router = Router();

router.route('/:id').post(getItem);

router.route('/list').get(getItems);

router.route('/create').post(validate(getItemsSchema), createItem);

export default router;
