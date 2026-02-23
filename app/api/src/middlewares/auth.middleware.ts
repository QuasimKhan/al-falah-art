import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { IUser, User } from "../modules/auth/auth.model";


/**
 * Extend Request type to include authenticated user
 */
export interface AuthRequest extends Request {
    user?: Omit<IUser, "password">;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1]
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

        req.user = user;

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