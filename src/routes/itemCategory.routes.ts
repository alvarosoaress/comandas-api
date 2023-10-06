import { Router } from 'express';
import validate from '../middleware/validateResource';
import verifyToken from '../middleware/verifyToken';
import {
  itemCategoryCreateSchema,
  itemCategoryRemoveSchema,
  itemCategorySetSchema,
} from '../modules/itemCategory/itemCategory.schema';
import { ItemCategoryFactory } from '../modules/itemCategory/itemCategory.factory';

const router = Router();

router
  .route('/create')
  .post(
    verifyToken('shop'),
    validate(itemCategoryCreateSchema),
    async (req, res) =>
      await ItemCategoryFactory().createItemCategory(req, res),
  );

router
  .route('/list')
  .get(
    verifyToken('admin'),
    async (req, res) => await ItemCategoryFactory().listItemCategory(req, res),
  );

router
  .route('/:id')
  .get(
    verifyToken('admin'),
    async (req, res) => await ItemCategoryFactory().getItemCategory(req, res),
  );

router
  .route('/set')
  .post(
    verifyToken('shop'),
    validate(itemCategorySetSchema),
    async (req, res) => await ItemCategoryFactory().setItemCategory(req, res),
  );

router
  .route('/remove')
  .delete(
    verifyToken('shop'),
    validate(itemCategoryRemoveSchema),
    async (req, res) =>
      await ItemCategoryFactory().removeItemCategory(req, res),
  );

export default router;
