import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { OrderService } from "./order.service";
import { success } from "zod";


export class OrderController {
    /**
     * Create Order
     */

    static create = asyncHandler(async (req: AuthRequest, res: Response) => {
        const order = await OrderService.createOrder(req.user.id, req.body);

        res.status(201).json({
            success: true,
            data: order
        });
    });

    /**
     * Get logged-in user's orders
     */

    static myOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
        const orders = await OrderService.getUserOrder(req.user?.id);
        res.status(200).json({
            success: true,
            data: orders
        });
    });


    /**
     * Admin: get all orders
     */

    static getAll = asyncHandler(async (_req: any, res: Response) => {
        const orders = OrderService.getAllOrder();

        res.status(200).json({
            success: true,
            data: orders
        });
    })


    /**
     * Admin: update order status
     */
    static updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
        const order = await OrderService.updateOrderStatus(req.params.id, req.body.status);

        res.status(200).json({
            success: true,
            data: order
        });
    })
}