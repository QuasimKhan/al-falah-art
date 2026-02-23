import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { signupSchema } from "./auth.schema";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { UserRole } from "./auth.model";

const router = Router();

router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/login", AuthController.login);
router.get("/me", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        data: (req as any).user
    });
})

router.get("/admin", authenticate, authorize(UserRole.ADMIN), (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome Admin"
    });
})

export default router;