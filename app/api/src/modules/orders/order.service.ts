import mongoose from "mongoose";
import { CreateOrderInput } from "./order.schema";
import { Product } from "../products/product.model";
import { ApiError } from "../../utils/ApiError";
import { Order } from "./order.model";

export class OrderService {
    /**
     * Create new order
     * Server calculates price to prevent tempering  
     */

    static async createOrder(userId: string, data: CreateOrderInput) {
        const { productId, quantity, selectedOptions, contentText, contentFile } = data;

        const product = await Product.findById(productId);

        if (!product) {
            throw new ApiError(404, "Product not found");
        };

        /** Base price calculation */
        const totalAmount = product.basePrice * quantity;

        const order = await Order.create({
            user: new mongoose.Types.ObjectId(userId),
            product: product._id,
            quantity,
            selectedOptions,
            contentText,
            contentFile,
            totalAmount
        })

        return order;
    }

    /**
    * Get orders for logged-in user
   */
    static async getUserOrder(userId: string) {
        return Order.find({ user: userId }).populate("product").sort({ createdAt: -1 })
    }

    /**
    * Admin: get all orders
     */
    static async getAllOrder() {
        return Order.find().populate("user", "name email").populate("product").sort({ createdAt: -1 })
    }

    /**
     * Admin: update order status
     */

    static async updateOrderStatus(orderId: string, orderStatus: string) {
        const order = await Order.findById(orderId);

        if (!order) {
            throw new ApiError(404, "Order not found")
        }

        order.orderStatus = orderStatus as any;
        await order.save()


        return order
    }

}