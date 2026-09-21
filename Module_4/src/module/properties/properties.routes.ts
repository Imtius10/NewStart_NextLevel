import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth/auth";
import { propertyController } from "./properties.Controller";

const router = Router();

// Protected landlord routes
router.post(
  "/",
  auth(UserRole.LANDLORD),
  propertyController.createProperty
);

router.put(
  "/:id",
  auth(UserRole.LANDLORD),
  propertyController.updateProperty
);

router.delete(
  "/:id",
  auth(UserRole.LANDLORD),
  propertyController.deleteProperty
);

// Public routes
router.get("/", propertyController.getAllProperties);

router.get(
  "/:id",
  propertyController.getPropertyById
);

export const propertyRouter = router;