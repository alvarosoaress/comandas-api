/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Request, type Response } from 'express';
import { type ReviewService } from './review.service';
import {
  type ReviewUpdateType,
  type ReviewCreateType,
  type ReviewDeleteType,
} from './review.schema';
import verifyOwnership from '../../middleware/verifyOwnership';
import { genericOwnership, reviewOwnership } from '../../middleware/ownership';
import { and, eq } from 'drizzle-orm';
import { type Order, order } from '../../../database/schema';
import { db } from '../../../database';
import { ForbiddenError } from '../../helpers/api.erros';

// TODO Mover isso para outro lugar (dentro do service de review)
async function canReview(
  customerId: number,
  shopId: number,
  req: Request<unknown, unknown, unknown>,
): Promise<void> {
  const requesterId = req.user.id;

  let canReview: Order | boolean | undefined = await db.query.order.findFirst({
    where: and(eq(order.shopId, shopId), eq(order.customerId, customerId)),
  });

  if (requesterId === 'admin') canReview = true;

  if (!canReview)
    throw new ForbiddenError(
      'Customer has no order in this shop that allow him to make a shop review',
    );
}

export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  async createReview(
    req: Request<unknown, unknown, ReviewCreateType>,
    res: Response,
  ) {
    verifyOwnership(
      genericOwnership(Number(req.user.id), req.body.shopId),
      req,
    );

    await canReview(req.body.customerId, req.body.shopId, req);

    const newReview = await this.reviewService.create(req.body);

    return res.status(200).json(newReview);
  }

  async updateReview(
    req: Request<unknown, unknown, ReviewUpdateType>,
    res: Response,
  ) {
    verifyOwnership(
      await reviewOwnership(Number(req.user.id), req.body.id),
      req,
    );

    const updatedReview = await this.reviewService.update(req.body);

    return res.status(200).json(updatedReview);
  }

  async deleteReview(req: Request<ReviewDeleteType>, res: Response) {
    verifyOwnership(genericOwnership(req.user.id, req.params.id), req);

    const deletedReview = await this.reviewService.delete(req.params.id);

    return res.status(200).json(deletedReview);
  }
}
