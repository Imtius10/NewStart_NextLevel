import { prisma } from "../../lib/prisma";
import { RentalStatus } from "../../../generated/prisma/client";

interface CreateReviewData {
  rentalRequestId: string;
  tenantId: string;
  rating: number;
  comment?: string;
}

const createReview = async (data: CreateReviewData) => {
  const {
    rentalRequestId,
    tenantId,
    rating,
    comment,
  } = data;

  // Validate rating
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  // Find rental request
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
      review: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  // Make sure the logged-in tenant owns this rental request
  if (rentalRequest.tenantId !== tenantId) {
    throw new Error(
      "You are not allowed to review this rental"
    );
  }

  // Only approved rentals can currently be reviewed
  if (rentalRequest.status !== RentalStatus.APPROVED) {
    throw new Error(
      "You can only review an approved rental"
    );
  }

  // Prevent duplicate review
  if (rentalRequest.review) {
    throw new Error(
      "You have already reviewed this rental"
    );
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      rentalRequestId,
      propertyId: rentalRequest.property.id,
      tenantId,
      rating,
      comment,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

const getPropertyReviews = async (
  propertyId: string,
  page: number = 1,
  limit: number = 10
) => {
  // Make sure property exists
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    select: {
      id: true,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  const pageNum = Math.max(1, page);
  const limitNum = Math.min(50, Math.max(1, limit));
  const skip = (pageNum - 1) * limitNum;

  const where = { propertyId };

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limitNum,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
    },
  };
};

export const reviewService = {
  createReview,
  getPropertyReviews,
};