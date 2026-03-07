import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ProductService } from "./product.service";
import { success } from "zod";


export class ProductController {
    static create = asyncHandler(async (req: Request, res: Response) => {
        const product = await ProductService.createProduct(req.body)

        res.status(201).json({
            success: true,
            message: "Product created",
            data: product
        })
    })


    static getAll = asyncHandler(async (_req: Request, res: Response) => {
        const products = await ProductService.getAllProduct()
        res.status(200).json({
            success: true,
            data: products
        });
    })

    static getOne = asyncHandler(async (req: Request, res: Response) => {
        const product = await ProductService.getProductById(req.params.id)

        res.status(200).json({
            success: true,
            data: product
        });
    })
}