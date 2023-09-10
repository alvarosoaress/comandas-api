import { Router } from 'express';
import validate from '../middleware/validateResource';
import { createItemSchema, getItemSchema } from '../modules/item/item.schema';
import { ItemFactory } from '../modules/item/item.factory';

const router = Router();
router
  .route('/create')
  .post(
    validate(createItemSchema),
    async (req, res) => await ItemFactory().createItem(req, res),
  );

router
  .route('/list')
  .get(async (req, res) => await ItemFactory().getItems(req, res));

router
  .route('/:id')
  .get(
    validate(getItemSchema),
    async (req, res) => await ItemFactory().getItemById(req, res),
  );

router
  .route('/update')
  .post(async (req, res) => await ItemFactory().updateItem(req, res));

export default router;
