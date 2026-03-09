import crypto from "crypto";
import { razorpay } from "../../config/razorpay";
import { Order, OrderStatus, PaymentStatus } from "./order.model";
import { ApiError } from "../../utils/ApiError";
import { env } from "../../config/env";

export class PaymentService {
    /**
   * Create Razorpay order
   */

    static async createPayment(orderId: string) {
        const order = await Order.findById(orderId)
        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        if (order.orderStatus !== OrderStatus.AWAITING_PAYMENT) {
            throw new ApiError(400, "Order not ready for payment");
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: (order.finalAmount || order.totalAmount) * 100,
            currency: "INR",
            receipt: order._id.toString()
        })

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return razorpayOrder;
    }

    /**
   * Verify Razorpay payment signature
   */
    static async verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) {
        const generatedSignature = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            throw new ApiError(400, "Invalid payment signature");
        }

        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        order.paymentStatus = PaymentStatus.PAID;
        order.orderStatus = OrderStatus.CONFIRMED;
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();

        return order;
    }
}