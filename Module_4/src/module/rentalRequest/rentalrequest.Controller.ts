import {
  Request,
  Response,
  NextFunction,
} from "express";

import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { rentalRequestService } from "./rentalrequest.Service";



const createRentalRequest = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const { propertyId, message } = req.body;

    const rentalRequest =
      await rentalRequestService.createRentalRequest({
        propertyId,
        tenantId: req.user.id,
        message,
      });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental request created successfully",
      data: rentalRequest,
    });
  }
);

const getMyRentalRequests = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const requests =
      await rentalRequestService.getMyRentalRequests(
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

const getRentalRequestById = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const { id } = req.params;

    const request =
      await rentalRequestService.getRentalRequestById(
        id as string,
        req.user.id
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request retrieved successfully",
      data: request,
    });
  }
);

export const rentalRequestController = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
};