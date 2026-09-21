import { Router } from "express";

import { UserRole } from "../../../generated/prisma/client";

import { auth } from "../../middlewares/auth/auth";
import { rentalRequestController } from "./rentalrequest.Controller";



const router = Router();

// Tenant creates rental request
router.post(
  "/",
  auth(UserRole.TENANT),
  rentalRequestController.createRentalRequest
);

// Tenant gets own rental requests
router.get(
  "/my-requests",
  auth(UserRole.TENANT),
  rentalRequestController.getMyRentalRequests
);

// Tenant gets one rental request
router.get(
  "/:id",
  auth(UserRole.TENANT),
  rentalRequestController.getRentalRequestById
);

export const rentalRequestRouter = router;