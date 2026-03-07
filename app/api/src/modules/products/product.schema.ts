import { z } from "zod"

/**
 * Schema for creating a new product
 * Used by admin
 */

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        basePrice: z.number().min(0),
        options: z.array(z.object({
            name: z.string().min(1),
            values: z.array(z.string().min(1)).min(1)
        })
        ).optional(),
        isActive: z.boolean().optional()

    })
})


export type CreateProductInput = z.infer<typeof createProductSchema>["body"]