import { prisma } from "../../lib/prisma";
import { RentalStatus } from "../../../generated/prisma/client";

const getMyRentalRequests = async (landlordId: string, page: number = 1, limit: number = 10) => {
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(50, Math.max(1, limit));
  const skip = (pageNum - 1) * limitNum;

  const where = {
    property: {
      landlordId,
    },
  };

  const [data, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            location: true,
            category: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            activeStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limitNum,
    }),
    prisma.rentalRequest.count({ where }),
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

const updateRentalRequestStatus = async (
  requestId: string,
  landlordId: string,
  status: RentalStatus
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      property: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  // Make sure this property belongs to this landlord
  if (rentalRequest.property.landlordId !== landlordId) {
    throw new Error(
      "You are not allowed to update this rental request"
    );
  }

  // Prevent changing an already processed request
  if (rentalRequest.status !== RentalStatus.PENDING) {
    throw new Error(
      "This rental request has already been processed"
    );
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          price: true,
          location: true,
          category: true,
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedRequest;
};

const getMyProperties = async (landlordId: string, page: number = 1, limit: number = 10) => {
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(50, Math.max(1, limit));
  const skip = (pageNum - 1) * limitNum;

  const where = { landlordId };

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        rentalRequests: {
          select: {
            id: true,
            status: true,
            message: true,
            tenant: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limitNum,
    }),
    prisma.property.count({ where }),
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

const getPropertyRequests = async (
  propertyId: string,
  landlordId: string
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  // Ownership check
  if (property.landlordId !== landlordId) {
    throw new Error(
      "You are not allowed to view requests for this property"
    );
  }

  const requests = await prisma.rentalRequest.findMany({
    where: {
      propertyId,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          activeStatus: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

export const landlordService = {
  getMyRentalRequests,
  updateRentalRequestStatus,
  getMyProperties,
  getPropertyRequests,
};