import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth/auth";
import { landlordController } from "./landlord.Controller";

const router = Router();

// Get all rental requests for landlord's properties
router.get(
  "/requests",
  auth(UserRole.LANDLORD),
  landlordController.getMyRentalRequests
);

// Approve or reject rental request
router.patch(
  "/requests/:id",
  auth(UserRole.LANDLORD),
  landlordController.updateRentalRequestStatus
);

// Get landlord's properties
router.get(
  "/properties",
  auth(UserRole.LANDLORD),
  landlordController.getMyProperties
);

// Get requests for a specific property
router.get(
  "/properties/:propertyId/requests",
  auth(UserRole.LANDLORD),
  landlordController.getPropertyRequests
);

export const landlordRouter = router;