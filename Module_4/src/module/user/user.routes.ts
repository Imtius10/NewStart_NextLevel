import { Router } from "express";
import { userController } from "./user.Controller";
import auth from "../../middlewares/auth/auth";



const router = Router();

router.post("/register", userController.userRegister);

router.post("/login", userController.userLogin);

router.get("/my-profile",auth ,userController.getMyProfile);







export const userRouter = router;