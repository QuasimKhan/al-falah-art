import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";

export class AuthController {
    /**
   * Handle user registration
   */

    static signup = asyncHandler(async (req: Request, res: Response) => {

        const user = await AuthService.signup(req.body)

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    })

    /**
   * Handle user login
   */

    static login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const result = await AuthService.login(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    });
}