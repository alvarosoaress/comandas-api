import { and, eq, sql } from 'drizzle-orm';
import { db } from '../../../database';
import { type IReviewRepository } from './Ireview.repository';
import {
  type Review,
  customer,
  review,
  shop,
  order,
} from '../../../database/schema';
import { type ReviewUpdateType, type ReviewCreateType } from './review.schema';
import { deleteObjKey } from '../../utils';

export class ReviewRepostiroy implements IReviewRepository {
  async shopExists(shopId: number): Promise<boolean> {
    const shopFound = await db.query.shop.findFirst({
      where: eq(shop.userId, shopId),
    });

    return !!shopFound;
  }

  async customerExists(customerId: number): Promise<boolean> {
    const customerFound = await db.query.customer.findFirst({
      where: eq(customer.userId, customerId),
    });

    return !!customerFound;
  }

  async canReview(customerId: number, shopId: number): Promise<boolean> {
    const canReview = await db.query.order.findFirst({
      where: and(eq(order.shopId, shopId), eq(order.customerId, customerId)),
    });

    return !!canReview;
  }

  async existsById(reviewId: string | number): Promise<boolean> {
    const reviewFound = await db.query.review.findFirst({
      where: eq(review.id, Number(reviewId)),
    });

    return !!reviewFound;
  }

  async exists(customerId: number, shopId: number): Promise<boolean> {
    const reviewFound = await db.query.review.findFirst({
      where: and(eq(review.shopId, shopId), eq(review.customerId, customerId)),
    });

    return !!reviewFound;
  }

  async getById(reviewId: string): Promise<Review | undefined> {
    const reviewFound = await db.query.review.findFirst({
      where: eq(review.id, Number(reviewId)),
    });

    return reviewFound;
  }

  async create(info: ReviewCreateType): Promise<Review | undefined> {
    const insertReturn = await db.insert(review).values(info);

    const insertId = insertReturn[0].insertId;

    const newReview = await db.query.review.findFirst({
      where: eq(review.id, insertId),
    });

    const newShopRating = await db
      .select({ avg: sql<number>`avg(rating)` })
      .from(review)
      .where(eq(review.shopId, info.shopId));

    await db
      .update(shop)
      .set({ rating: newShopRating[0].avg ?? 0 })
      .where(eq(shop.userId, info.shopId));

    return newReview;
  }

  async update(newReviewInfo: ReviewUpdateType): Promise<Review | undefined> {
    newReviewInfo.updatedAt = new Date();

    // Salvando e retirando id de newReviewInfo
    // para evitar o usuário atualizar o id no BD
    const reviewId = newReviewInfo.id;

    deleteObjKey(newReviewInfo, 'id');

    await db.update(review).set(newReviewInfo).where(eq(review.id, reviewId));

    const updatedReview = await db.query.review.findFirst({
      where: eq(review.id, reviewId),
    });

    if (!updatedReview) return undefined;

    return updatedReview;
  }

  async delete(reviewId: string): Promise<Review | undefined> {
    const deletedReview = await db.query.review.findFirst({
      where: eq(review.id, Number(reviewId)),
    });

    await db.delete(review).where(eq(review.id, Number(reviewId)));

    return deletedReview;
  }
}
