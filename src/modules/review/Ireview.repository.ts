import { type Review } from '../../../database/schema';
import { type ReviewUpdateType, type ReviewCreateType } from './review.schema';

// TODO Implementar método para poder editar reviews, da forma atual o usuário só pode fazer uma review do shop

export type IReviewRepository = {
  shopExists: (shopId: number) => Promise<boolean>;
  customerExists: (customerId: number) => Promise<boolean>;
  exists: (customerId: number, shopId: number) => Promise<boolean>;
  existsById: (reviewId: string | number) => Promise<boolean>;
  canReview: (customerId: number, shopId: number) => Promise<boolean>;
  getById: (reviewId: string) => Promise<Review | undefined>;
  update: (newReviewInfo: ReviewUpdateType) => Promise<Review | undefined>;
  delete: (reviewId: string) => Promise<Review | undefined>;
  create: (info: ReviewCreateType) => Promise<Review | undefined>;
};
