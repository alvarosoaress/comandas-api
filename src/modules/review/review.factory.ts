import { ReviewController } from './review.controller';
import { ReviewRepostiroy } from './review.repository';
import { ReviewService } from './review.service';

export default function reviewFactory(): ReviewController {
  const reviewRepository = new ReviewRepostiroy();
  const reviewService = new ReviewService(reviewRepository);
  const reviewController = new ReviewController(reviewService);
  return reviewController;
}
