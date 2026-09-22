import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.Service";

/**
 * ============================================================
 * CREATE PAYMENT
 * ============================================================
 */
const createPayment = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const { rentalRequestId } =
      req.body;

    if (!rentalRequestId) {
      throw new Error(
        "Rental request ID is required"
      );
    }

    const result =
      await paymentService.createPayment(
        rentalRequestId,
        req.user.id
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message:
        "Payment session created successfully",
      data: result,
    });
  }
);

/**
 * ============================================================
 * GET MY PAYMENTS
 * ============================================================
 */
const getMyPayments = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result =
      await paymentService.getMyPayments(
        req.user.id,
        page,
        limit
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:
        "Payment history retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

/**
 * ============================================================
 * GET PAYMENT BY ID
 * ============================================================
 */
const getPaymentById = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const { id } = req.params;

    const payment =
      await paymentService.getPaymentById(
        id as string,
        req.user.id
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:
        "Payment retrieved successfully",
      data: payment,
    });
  }
);

/**
 * ============================================================
 * DEV: Confirm Payment (simulates Stripe webhook)
 * ============================================================
 */
const testConfirmPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { paymentId } = req.body;

    if (!paymentId) {
      throw new Error("Payment ID is required");
    }

    const result =
      await paymentService.testConfirmPayment(paymentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed successfully (dev mode)",
      data: result,
    });
  }
);

export const paymentController = {
  createPayment,
  getMyPayments,
  getPaymentById,
  testConfirmPayment,
};