import { prisma } from "../../lib/prisma";
import { CreateCategoryData } from "./category.interface";

const createCategory = async (data: CreateCategoryData) => {
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new Error("Category already exists");
  }

  return prisma.category.create({
    data: { name: data.name },
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const updateCategory = async (id: string, name: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const existing = await prisma.category.findUnique({
    where: { name },
  });

  if (existing && existing.id !== id) {
    throw new Error("Category name already exists");
  }

  return prisma.category.update({
    where: { id },
    data: { name },
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: { id },
  });

  return null;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
