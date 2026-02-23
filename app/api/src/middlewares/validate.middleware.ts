import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodTypeAny } from "zod";

export const validate =
    (schema: ZodTypeAny) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse({
                    body: req.body,
                    params: req.params,
                    query: req.query,
                });

                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        success: false,
                        message: error.issues[0].message, // ✅ exact Zod message
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                });
            }
        };