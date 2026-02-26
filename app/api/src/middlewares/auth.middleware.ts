import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { IUser, User } from "../modules/auth/auth.model";


/**
 * Extend Request type to include authenticated user
 */
export interface AuthRequest extends Request {
    user?: {
        id: string,
        role: string,
        email: string
    }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies.accessToken
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const decoded = Jwt.verify(token, env.JWT_SECRET) as JwtPayload & {
            id: string;
            role: string;
        }

        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = {
            id: user._id.toString(),
            role: user.role,
            email: user.email
        }

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}


/**
 * - Restrict access based on roles
 */
export const authorize =
    (...roles: string[]) =>
        (req: AuthRequest, res: Response, next: NextFunction) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden"
                });
            }

            next();
        };