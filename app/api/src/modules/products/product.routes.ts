import { Router } from "express";
import { ProductController } from "./product.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRole } from "../auth/auth.model";
import { validate } from "../../middlewares/validate.middleware";
import { createProductSchema } from "./product.schema";

const router = Router()

/** Public Routes */
router.get("/", ProductController.getAll)
router.get("/:id", ProductController.getOne)


/** Admin Routes */
router.post("/", authenticate, authorize(UserRole.ADMIN), validate(createProductSchema), ProductController.create)

export default router;