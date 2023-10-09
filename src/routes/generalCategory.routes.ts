import express from 'express';
import validate from '../middleware/validateResource';
import {
  generalCategoryCreateSchema,
  generalCategoryGetSchema,
  generalCategoryUpdateSchema,
  generalCategorySetSchema,
  generalCategoryDeleteSchema,
  generalCategoryShopListSchema,
} from '../modules/generalCategory/generalCategory.schema';
import { generalCategoryFactory } from '../modules/generalCategory/generalCategory.factory';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router
  .route('/create')
  .post(
    verifyToken('admin'),
    validate(generalCategoryCreateSchema),
    async (req, res) =>
      await generalCategoryFactory().createGeneralCategory(req, res),
  );

router
  .route('/list')
  .get(
    async (req, res) =>
      await generalCategoryFactory().getGeneralCategories(req, res),
  );

router
  .route('/:id')
  .get(
    validate(generalCategoryGetSchema),
    async (req, res) =>
      await generalCategoryFactory().getGeneralCategoryById(req, res),
  );

router
  .route('/update')
  .put(
    verifyToken('admin'),
    validate(generalCategoryUpdateSchema),
    async (req, res) =>
      await generalCategoryFactory().updateGeneralCategory(req, res),
  );

router
  .route('/delete/:id')
  .delete(
    verifyToken('admin'),
    validate(generalCategoryDeleteSchema),
    async (req, res) =>
      await generalCategoryFactory().deleteGeneralCategory(req, res),
  );

router
  .route('/set')
  .post(
    verifyToken('shop'),
    validate(generalCategorySetSchema),
    async (req, res) =>
      await generalCategoryFactory().setGeneralCategory(req, res),
  );

router
  .route('/remove')
  .delete(
    verifyToken('shop'),
    validate(generalCategorySetSchema),
    async (req, res) =>
      await generalCategoryFactory().removeGeneralCategory(req, res),
  );

router
  .route('/shop/:id')
  .get(
    validate(generalCategoryShopListSchema),
    async (req, res) =>
      await generalCategoryFactory().getShopListCategories(req, res),
  );

export default router;
