import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/client";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      activeStatus: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const updateUserStatus = async (
  userId: string,
  status: UserStatus
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      activeStatus: status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      activeStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const getAllProperties = async () => {
  const properties = await prisma.property.findMany({
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          activeStatus: true,
        },
      },
      rentalRequests: {
        select: {
          id: true,
          status: true,
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

const deleteProperty = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });

  return null;
};

const getAllRentalRequests = async () => {
  const requests = await prisma.rentalRequest.findMany({
    include: {
      property: {
        select: {
          id: true,
          title: true,
          price: true,
          location: true,
          category: true,
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

const getStatistics = async () => {
  const [
    totalUsers,
    totalLandlords,
    totalTenants,
    totalProperties,
    totalRentalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "LANDLORD",
      },
    }),

    prisma.user.count({
      where: {
        role: "TENANT",
      },
    }),

    prisma.property.count(),

    prisma.rentalRequest.count(),

    prisma.rentalRequest.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.rentalRequest.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.rentalRequest.count({
      where: {
        status: "REJECTED",
      },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      landlords: totalLandlords,
      tenants: totalTenants,
    },
    properties: {
      total: totalProperties,
    },
    rentalRequests: {
      total: totalRentalRequests,
      pending: pendingRequests,
      approved: approvedRequests,
      rejected: rejectedRequests,
    },
  };
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  deleteProperty,
  getAllRentalRequests,
  getStatistics,
};