import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createOrderSchema, reviewOrderSchema, updateOrderStatusSchema } from "./order.schema";
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

router.post(
    "/:id/pay",
    authenticate,
    OrderController.createPayment
);

router.post(
    "/verify-payment",
    authenticate,
    OrderController.verifyPayment
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

router.patch("/:id/review", authenticate, authorize(UserRole.ADMIN), validate(reviewOrderSchema), OrderController.review)

export default router;