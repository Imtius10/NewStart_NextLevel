import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { landlordService } from "./landlord.Service";
import { RentalStatus } from "../../../generated/prisma/client";

const getMyRentalRequests = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const requests = await landlordService.getMyRentalRequests(
      req.user.id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: requests,
    });
  }
);

const updateRentalRequestStatus = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const { id } = req.params;
    const { status } = req.body;

    if (
      status !== RentalStatus.APPROVED &&
      status !== RentalStatus.REJECTED
    ) {
      throw new Error(
        "Status must be APPROVED or REJECTED"
      );
    }

    const updatedRequest =
      await landlordService.updateRentalRequestStatus(
        id as string,
        req.user.id,
        status
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: `Rental request ${status.toLowerCase()} successfully`,
      data: updatedRequest,
    });
  }
);

const getMyProperties = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const properties = await landlordService.getMyProperties(
      req.user.id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your properties retrieved successfully",
      data: properties,
    });
  }
);

const getPropertyRequests = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const { propertyId } = req.params;

    const requests =
      await landlordService.getPropertyRequests(
        propertyId as string,
        req.user.id
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property rental requests retrieved successfully",
      data: requests,
    });
  }
);

export const landlordController = {
  getMyRentalRequests,
  updateRentalRequestStatus,
  getMyProperties,
  getPropertyRequests,
};