import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/auth/auth";
import { adminController } from "./admin.Controller";

const router = Router();

// All admin routes require ADMIN role

router.get(
  "/users",
  auth(UserRole.ADMIN),
  adminController.getAllUsers
);

router.patch(
  "/users/:id/status",
  auth(UserRole.ADMIN),
  adminController.updateUserStatus
);

router.get(
  "/properties",
  auth(UserRole.ADMIN),
  adminController.getAllProperties
);

router.delete(
  "/properties/:id",
  auth(UserRole.ADMIN),
  adminController.deleteProperty
);

router.get(
  "/rental-requests",
  auth(UserRole.ADMIN),
  adminController.getAllRentalRequests
);

router.get(
  "/statistics",
  auth(UserRole.ADMIN),
  adminController.getStatistics
);

export const adminRouter = router;