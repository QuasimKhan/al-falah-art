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

        const result = await AuthService.login(req.body);


        res.cookie("accessToken", result.token, {
            httpOnly: true,     // JS cannot read it
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    });
}