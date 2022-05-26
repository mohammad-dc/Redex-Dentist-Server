import { Router } from "express";
import { checkAccessTokenValidation } from "../middlewares/checkAccessTokenValidation";
import { checkRequestValidation } from "../middlewares/requestValidation";
import { ReviewsService } from "../services/reviews.service";
import { reviewsSchema } from "../validations/reviews.validation";

export const reviewsRouter = Router({ mergeParams: true });
const reviewService = new ReviewsService();

reviewsRouter.post(
  "/add",
  checkAccessTokenValidation,
  checkRequestValidation(reviewsSchema),
  reviewService.addReview
);

reviewsRouter.get(
  "/:doctor_id",
  checkAccessTokenValidation,
  reviewService.getAllReview
);
