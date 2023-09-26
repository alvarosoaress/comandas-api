import { Router } from 'express';
import validate from '../middleware/validateResource';
import {
  itemCreateSchema,
  itemGetSchema,
  itemUpdateSchema,
} from '../modules/item/item.schema';
import { ItemFactory } from '../modules/item/item.factory';

const router = Router();

router
  .route('/create')
  .post(
    validate(itemCreateSchema),
    async (req, res) => await ItemFactory().createItem(req, res),
  );

router
  .route('/list')
  .get(async (req, res) => await ItemFactory().getItems(req, res));

router
  .route('/:id')
  .get(
    validate(itemGetSchema),
    async (req, res) => await ItemFactory().getItemById(req, res),
  );

router
  .route('/update')
  .put(
    validate(itemUpdateSchema),
    async (req, res) => await ItemFactory().updateItem(req, res),
  );

export default router;
