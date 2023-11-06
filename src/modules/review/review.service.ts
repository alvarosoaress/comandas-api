import { type Review } from '../../../database/schema';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../helpers/api.erros';
import { type IReviewRepository } from './Ireview.repository';
import { type ReviewUpdateType, type ReviewCreateType } from './review.schema';

export class ReviewService {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async create(info: ReviewCreateType): Promise<Review | undefined> {
    const shopExists = await this.reviewRepository.shopExists(info.shopId);

    if (!shopExists) throw new NotFoundError('Shop not found');

    const customerExists = await this.reviewRepository.customerExists(
      info.customerId,
    );

    if (!customerExists) throw new NotFoundError('Customer not found');

    const alreadyReviewed = await this.reviewRepository.exists(
      info.customerId,
      info.shopId,
    );

    if (alreadyReviewed)
      throw new ConflictError('Customer already wrote a review for this shop');

    const newReview = await this.reviewRepository.create(info);

    if (!newReview) throw new InternalServerError();

    return newReview;
  }

  async update(newReviewInfo: ReviewUpdateType): Promise<Review | undefined> {
    const exists = await this.reviewRepository.existsById(newReviewInfo.id);

    if (!exists) throw new NotFoundError('Review not found');

    const newReview = await this.reviewRepository.update(newReviewInfo);

    if (!newReview) throw new InternalServerError();

    return newReview;
  }

  async delete(reviewId: string): Promise<Review | undefined> {
    const exists = await this.reviewRepository.existsById(reviewId);

    if (!exists) throw new NotFoundError('Review not found');

    const reviewDeleted = await this.reviewRepository.delete(reviewId);

    if (!reviewDeleted) throw new InternalServerError();

    return reviewDeleted;
  }
}
