import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./admin.Service";
import { UserStatus, UserRole } from "../../../generated/prisma/client";

const getAllUsers = catchAsync(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await adminService.getAllUsers(page, limit);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: result.data,
      meta: result.meta,
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await adminService.getAllProperties(page, limit);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All properties retrieved successfully",
      data: result.data,
      meta: result.meta,
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result =
      await adminService.getAllRentalRequests(page, limit);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rental requests retrieved successfully",
      data: result.data,
      meta: result.meta,
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

const updateUserRole = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (
      role !== UserRole.TENANT &&
      role !== UserRole.LANDLORD
    ) {
      throw new Error(
        "Role must be TENANT or LANDLORD"
      );
    }

    const user = await adminService.updateUserRole(
      id as string,
      role
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User role updated successfully",
      data: user,
    });
  }
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getAllProperties,
  deleteProperty,
  getAllRentalRequests,
  getStatistics,
};