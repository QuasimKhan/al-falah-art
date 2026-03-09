import mongoose, { Document } from "mongoose";

/**
 * Order status lifecycle
 */
export enum OrderStatus {
    PENDING_REVIEW = "PENDING_REVIEW",
    AWAITING_PAYMENT = "AWAITING_PAYMENT",
    CONFIRMED = "CONFIRMED",
    PRINTING = "PRINTING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

/**
 * Payment status
 */
export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED"
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;

    quantity: number;

    selectedOptions: {
        name: string;
        value: string;
    }[];

    contentText?: string;
    contentFile?: string;

    totalAmount: number;
    finalAmount: number;

    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;

    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;

    createdAt: Date;
    updatedAt: Date;
}



const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    selectedOptions: [
        {
            name: String,
            value: String,
            _id: false /** prevent mongoose subdocument id */
        }
    ],

    contentText: {
        type: String
    },

    contentFile: {
        type: String
    },

    totalAmount: {
        type: Number,
        required: true
    },

    finalAmount: {
        type: Number
    },

    orderStatus: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING_REVIEW
    },

    paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String


}, {
    timestamps: true
})

export const Order = mongoose.model<IOrder>("Order", orderSchema)