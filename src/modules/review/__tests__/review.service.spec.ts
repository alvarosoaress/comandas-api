import { type Review } from '../../../../database/schema';
import { ConflictError, NotFoundError } from '../../../helpers/api.erros';
import { type IReviewRepository } from '../Ireview.repository';
import {
  type ReviewUpdateType,
  type ReviewCreateType,
  type ReviewDeleteType,
} from '../review.schema';
import { ReviewService } from '../review.service';

let reviewService: ReviewService;
let reviewRepositoryMock: jest.Mocked<IReviewRepository>;

beforeEach(() => {
  reviewRepositoryMock = {
    exists: jest.fn(),
    shopExists: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
    customerExists: jest.fn(),
    existsById: jest.fn(),
    delete: jest.fn(),
    canReview: jest.fn(),
    update: jest.fn(),
  };

  reviewService = new ReviewService(reviewRepositoryMock);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Review Service', () => {
  const review: Review = {
    id: 1,
    customerId: 1,
    shopId: 1,
    rating: 4.58,
    comment: 'Very good mesmo',
  };
  describe('Create Review', () => {
    const reviewInfo: ReviewCreateType = {
      customerId: 1,
      shopId: 1,
      rating: 4.58,
      comment: 'Very good mesmo',
    };

    it('should return a new review', async () => {
      reviewRepositoryMock.shopExists.mockResolvedValue(true);
      reviewRepositoryMock.customerExists.mockResolvedValue(true);
      reviewRepositoryMock.exists.mockResolvedValue(false);
      reviewRepositoryMock.create.mockResolvedValue(review);

      const newReview = await reviewService.create(reviewInfo);

      expect(reviewRepositoryMock.shopExists).toBeCalledWith(reviewInfo.shopId);
      expect(reviewRepositoryMock.customerExists).toBeCalledWith(
        reviewInfo.customerId,
      );
      expect(reviewRepositoryMock.exists).toBeCalledWith(
        reviewInfo.customerId,
        reviewInfo.shopId,
      );
      expect(reviewRepositoryMock.create).toBeCalledWith(reviewInfo);

      expect(newReview).toHaveProperty('id');
    });

    it('should throw a error if no shop found with specified id', async () => {
      reviewRepositoryMock.shopExists.mockResolvedValue(false);

      await expect(reviewService.create(reviewInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(reviewRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw a error if no customer found with specified id', async () => {
      reviewRepositoryMock.shopExists.mockResolvedValue(true);
      reviewRepositoryMock.customerExists.mockResolvedValue(false);

      await expect(reviewService.create(reviewInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(reviewRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw a error customer already wrote a review for shop with specified id', async () => {
      reviewRepositoryMock.shopExists.mockResolvedValue(true);
      reviewRepositoryMock.customerExists.mockResolvedValue(true);
      reviewRepositoryMock.exists.mockResolvedValue(true);

      await expect(reviewService.create(reviewInfo)).rejects.toThrowError(
        ConflictError,
      );

      expect(reviewRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('Update Review', () => {
    const reviewInfo: ReviewUpdateType = {
      id: 1,
      rating: 2.58,
      comment: 'Not so good anymore',
    };

    it('should return a updated review', async () => {
      reviewRepositoryMock.existsById.mockResolvedValue(true);
      reviewRepositoryMock.update.mockResolvedValue(review);

      const updatedReview = await reviewService.update(reviewInfo);

      expect(reviewRepositoryMock.existsById).toBeCalledWith(reviewInfo.id);
      expect(reviewRepositoryMock.update).toBeCalledWith(reviewInfo);

      expect(updatedReview).toHaveProperty('id');
    });

    it('should throw a review not found with specified id', async () => {
      reviewRepositoryMock.exists.mockResolvedValue(false);

      await expect(reviewService.update(reviewInfo)).rejects.toThrowError(
        NotFoundError,
      );

      expect(reviewRepositoryMock.update).not.toHaveBeenCalled();
    });
  });

  describe('Delete Review', () => {
    const reviewInfo: ReviewDeleteType = {
      id: '1',
    };

    it('should return the deleted review', async () => {
      reviewRepositoryMock.existsById.mockResolvedValue(true);
      reviewRepositoryMock.delete.mockResolvedValue(review);

      const deletedReview = await reviewService.delete(reviewInfo.id);

      expect(reviewRepositoryMock.existsById).toBeCalledWith(reviewInfo.id);
      expect(reviewRepositoryMock.delete).toBeCalledWith(reviewInfo.id);

      expect(deletedReview).toHaveProperty('id');
    });

    it('should throw a review not found with specified id', async () => {
      reviewRepositoryMock.exists.mockResolvedValue(false);

      await expect(reviewService.delete(reviewInfo.id)).rejects.toThrowError(
        NotFoundError,
      );

      expect(reviewRepositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});
