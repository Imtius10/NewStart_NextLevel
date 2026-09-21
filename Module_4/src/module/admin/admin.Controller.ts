import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./admin.Service";
import { UserStatus } from "../../../generated/prisma/client";

const getAllUsers = catchAsync(
  async (req: Request, res: Response) => {
    const users = await adminService.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: users,
    });
  }
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (
      status !== UserStatus.ACTIVE &&
      status !== UserStatus.BLOCKED
    ) {
      throw new Error(
        "Status must be ACTIVE or BLOCKED"
      );
    }

    const user = await adminService.updateUserStatus(
      id as string,
      status
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: user,
    });
  }
);

const getAllProperties = catchAsync(
  async (req: Request, res: Response) => {
    const properties = await adminService.getAllProperties();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All properties retrieved successfully",
      data: properties,
    });
  }
);

const deleteProperty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await adminService.deleteProperty(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted successfully",
      data: null,
    });
  }
);

const getAllRentalRequests = catchAsync(
  async (req: Request, res: Response) => {
    const requests =
      await adminService.getAllRentalRequests();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rental requests retrieved successfully",
      data: requests,
    });
  }
);

const getStatistics = catchAsync(
  async (req: Request, res: Response) => {
    const statistics = await adminService.getStatistics();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Admin statistics retrieved successfully",
      data: statistics,
    });
  }
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  deleteProperty,
  getAllRentalRequests,
  getStatistics,
};