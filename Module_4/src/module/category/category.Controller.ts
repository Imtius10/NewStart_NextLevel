import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.Service";

const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
      throw new Error("Category name is required");
    }

    const category = await categoryService.createCategory({ name });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: category,
    });
  }
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: categories,
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      throw new Error("Category name is required");
    }

    const category = await categoryService.updateCategory(id as string, name);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category updated successfully",
      data: category,
    });
  }
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await categoryService.deleteCategory(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category deleted successfully",
      data: null,
    });
  }
);

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
