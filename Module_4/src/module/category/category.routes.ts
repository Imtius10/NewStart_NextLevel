import { Router } from "express";
import { categoryController } from "./category.Controller";

const router = Router();

router.get("/", categoryController.getAllCategories);

export const categoryRouter = router;