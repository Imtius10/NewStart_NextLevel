import { Router } from "express";
import { userController } from "./user.Controller";



const router = Router();

router.post("/register",userController.userRegister);





export const userRouter = router;