import { Router } from "express";

import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth/auth";

import { paymentController } from "./payment.Controller";

const router = Router();

/**
 * Create Stripe Checkout Session
 */
router.post(
  "/create",
  auth(UserRole.TENANT),
  paymentController.createPayment
);

/**
 * Tenant payment history
 */
router.get(
  "/",
  auth(UserRole.TENANT),
  paymentController.getMyPayments
);

/**
 * Get one payment
 */
router.get(
  "/:id",
  auth(UserRole.TENANT),
  paymentController.getPaymentById
);

/**
 * DEV: Confirm payment (simulates Stripe webhook)
 */
router.post(
  "/confirm",
  paymentController.testConfirmPayment
);

export const paymentRouter = router;
