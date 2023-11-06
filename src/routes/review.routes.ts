import { Router } from 'express';
import validate from '../middleware/validateResource';
import verifyToken from '../middleware/verifyToken';
import {
  reviewCreateSchema,
  reviewDeleteSchema,
  reviewUpdateSchema,
} from '../modules/review/review.schema';
import reviewFactory from '../modules/review/review.factory';
const router = Router();

router
  .route('/create')
  .post(
    verifyToken('customer'),
    validate(reviewCreateSchema),
    async (req, res) => await reviewFactory().createReview(req, res),
  );

router
  .route('/update')
  .put(
    verifyToken('customer'),
    validate(reviewUpdateSchema),
    async (req, res) => await reviewFactory().updateReview(req, res),
  );

router
  .route('/delete/:id')
  .delete(
    verifyToken('customer'),
    validate(reviewDeleteSchema),
    async (req, res) => await reviewFactory().deleteReview(req, res),
  );

export default router;
