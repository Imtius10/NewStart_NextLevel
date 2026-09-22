import { Router } from "express";
import { propertyController } from "./properties.Controller";

const router = Router();

// Public routes
router.get("/categories", propertyController.getCategories);

router.get("/", propertyController.getAllProperties);

router.get(
  "/:id",
  propertyController.getPropertyById
);

export const propertyRouter = router;
