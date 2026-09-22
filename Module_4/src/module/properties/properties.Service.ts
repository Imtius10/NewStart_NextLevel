import { prisma } from "../../lib/prisma";
import {
  CreatePropertyData,
  PropertyQuery,
  UpdatePropertyData,
} from "./properties.interface";

const createProperty = async (data: CreatePropertyData) => {
  const property = await prisma.property.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      category: data.category,
      landlordId: data.landlordId,
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return property;
};

// const getAllProperties = async () => {
//   const result = await prisma.property.findMany({
//     include: {
//       landlord: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//         },
//       },
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return result;
// };

const getAllProperties = async (query: PropertyQuery) => {
  const { location, category, minPrice, maxPrice, search, page = "1", limit = "10" } = query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  // Location filter
  if (location) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  // Category filter
  if (category) {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  // Price filter
  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }

  // General search
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        location: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        category: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
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


const getPropertyById = async (propertyId: string) => {
  const result = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Property not found");
  }

  return result;
};

const updateProperty = async (
  id: string,
  landlordId: string,
  data: UpdatePropertyData
) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new Error("You are not allowed to update this property");
  }

  const updatedProperty = await prisma.property.update({
    where: { id },
    data,
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedProperty;
};

const deleteProperty = async (
  id: string,
  landlordId: string
) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new Error("You are not allowed to delete this property");
  }

  await prisma.property.delete({
    where: { id },
  });

  return null;
};

export const propertyService = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};