import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth/auth";
import { propertyController } from "../properties/properties.Controller";
import { landlordController } from "./landlord.Controller";

const router = Router();

// Property CRUD (Landlord only)
router.post(
  "/properties",
  auth(UserRole.LANDLORD),
  propertyController.createProperty
);

router.put(
  "/properties/:id",
  auth(UserRole.LANDLORD),
  propertyController.updateProperty
);

router.delete(
  "/properties/:id",
  auth(UserRole.LANDLORD),
  propertyController.deleteProperty
);

// Landlord's properties list
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

export const landlordRouter = router;
