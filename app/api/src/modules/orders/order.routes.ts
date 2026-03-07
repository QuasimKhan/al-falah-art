import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "./order.schema";
import { UserRole } from "../auth/auth.model";

const router = Router();

/** User routes */

router.post(
    "/",
    authenticate,
    validate(createOrderSchema),
    OrderController.create
);

router.get(
    "/my",
    authenticate,
    OrderController.myOrders
);

/** Admin routes */

router.get(
    "/",
    authenticate,
    authorize(UserRole.ADMIN),
    OrderController.getAll
);

router.patch(
    "/:id/status",
    authenticate,
    authorize(UserRole.ADMIN),
    validate(updateOrderStatusSchema),
    OrderController.updateStatus
);

export default router;