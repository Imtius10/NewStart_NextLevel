import { Router } from "express";
import { userController } from "./user.Controller";
import { auth } from "../../middlewares/auth/auth";
import { UserRole } from "../../../generated/prisma/client";





const router = Router();

router.post("/register", userController.userRegister);

router.post("/login", userController.userLogin);

router.post("/refresh-token", userController.refreshToken);

router.post("/logout", userController.logout);

router.get("/my-profile", auth(), userController.getMyProfile);








export const userRouter = router;