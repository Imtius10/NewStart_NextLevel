import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.Service";

const createReview = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const {
      rentalRequestId,
      rating,
      comment,
    } = req.body;

    if (!rentalRequestId) {
      throw new Error("Rental request ID is required");
    }

    if (rating === undefined) {
      throw new Error("Rating is required");
    }

    const review = await reviewService.createReview({
      rentalRequestId,
      tenantId: req.user.id,
      rating: Number(rating),
      comment,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Review created successfully",
      data: review,
    });
  }
);

const getPropertyReviews = catchAsync(
  async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const reviews =
      await reviewService.getPropertyReviews(propertyId as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  }
);

export const reviewController = {
  createReview,
  getPropertyReviews,
};