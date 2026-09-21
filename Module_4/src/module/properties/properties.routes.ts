import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";

import { auth } from "../../middlewares/auth/auth";
import { propertyController } from "./properties.Controller";


const router = Router();

// Public routes
router.get(
  "/",
  propertyController.getAllProperties
);

router.get(
  "/:id",
  propertyController.getPropertyById
);

// Landlord routes
router.post(
  "/",
  auth(UserRole.Landlord),
  propertyController.createProperty
);

router.put(
  "/:id",
  auth(UserRole.Landlord),
  propertyController.updateProperty
);

router.delete(
  "/:id",
  auth(UserRole.Landlord),
  propertyController.deleteProperty
);

export const propertyRouter = router;