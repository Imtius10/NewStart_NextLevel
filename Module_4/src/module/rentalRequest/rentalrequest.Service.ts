import { prisma } from "../../lib/prisma";
import { CreateRentalRequestData } from "./rentalrequest.interface";


const createRentalRequest = async (
  data: CreateRentalRequestData
) => {
  // Check property exists
  const property = await prisma.property.findUnique({
    where: {
      id: data.propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  // Check if tenant already requested this property
  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: data.propertyId,
      tenantId: data.tenantId,
    },
  });

  if (existingRequest) {
    throw new Error(
      "You have already requested this property"
    );
  }

  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      propertyId: data.propertyId,
      tenantId: data.tenantId,
      message: data.message,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          price: true,
          location: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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

  return rentalRequest;
};

const getMyRentalRequests = async (
  tenantId: string
) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          location: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

const getRentalRequestById = async (
  requestId: string,
  tenantId: string
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      property: {
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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

  if (!request) {
    throw new Error("Rental request not found");
  }

  if (request.tenantId !== tenantId) {
    throw new Error(
      "You are not allowed to view this rental request"
    );
  }

  return request;
};

export const rentalRequestService = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
};