import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";

import { auth } from "../../middlewares/auth/auth";
import { reviewController } from "./review.Controller";

const router = Router();

// Tenant creates a review
router.post(
  "/",
  auth(UserRole.TENANT),
  reviewController.createReview
);

// Public: view reviews for a property
router.get(
  "/property/:propertyId",
  reviewController.getPropertyReviews
);

export const reviewRouter = router;