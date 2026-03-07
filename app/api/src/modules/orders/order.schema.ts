import { z } from "zod";

/**
 * Schema for creating a new order
 */
export const createOrderSchema = z.object({
    body: z.object({
        productId: z.string(),

        quantity: z.number().min(1),

        selectedOptions: z
            .array(
                z.object({
                    name: z.string(),
                    value: z.string()
                })
            )
            .optional(),

        contentText: z.string().optional(),
        contentFile: z.string().optional()
    })
});

export type CreateOrderInput =
    z.infer<typeof createOrderSchema>["body"];


import { OrderStatus } from "./order.model";

export const updateOrderStatusSchema = z.object({
    body: z.object({
        status: z.nativeEnum(OrderStatus)
    })
});

export type UpdateOrderStatusInput =
    z.infer<typeof updateOrderStatusSchema>["body"];