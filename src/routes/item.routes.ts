import { Router } from 'express';
import validate from '../middleware/validateResource';
import {
  itemCreateSchema,
  itemDeleteSchema,
  itemGetSchema,
  itemUpdateSchema,
} from '../modules/item/item.schema';
import { itemFactory } from '../modules/item/item.factory';
import verifyToken from '../middleware/verifyToken';

const router = Router();

router
  .route('/create')
  .post(
    verifyToken('shop'),
    validate(itemCreateSchema),
    async (req, res) => await itemFactory().createItem(req, res),
  );

router
  .route('/list')
  .get(
    verifyToken('admin'),
    async (req, res) => await itemFactory().getItems(req, res),
  );

router
  .route('/:id')
  .get(
    validate(itemGetSchema),
    async (req, res) => await itemFactory().getItemById(req, res),
  );

router
  .route('/update')
  .put(
    verifyToken('shop'),
    validate(itemUpdateSchema),
    async (req, res) => await itemFactory().updateItem(req, res),
  );

router
  .route('/delete/:id')
  .delete(
    verifyToken('shop'),
    validate(itemDeleteSchema),
    async (req, res) => await itemFactory().deleteItem(req, res),
  );

export default router;
