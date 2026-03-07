import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {

    console.error("ERROR:", err); /** log full error in console */
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
}