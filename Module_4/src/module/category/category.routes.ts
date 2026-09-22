import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth/auth";
import { categoryController } from "./category.Controller";

const router = Router();

// Public: get all categories
router.get("/", categoryController.getAllCategories);

// Admin: manage categories
router.post(
  "/",
  auth(UserRole.ADMIN),
  categoryController.createCategory
);

router.put(
  "/:id",
  auth(UserRole.ADMIN),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  categoryController.deleteCategory
);

export const categoryRouter = router;
