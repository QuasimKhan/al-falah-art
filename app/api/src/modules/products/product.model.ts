import mongoose, { Document } from "mongoose";

/**
 * Option type for configurable product attributes
 * Example: Size -> A4, A3
 *          Paper -> Matte, Glossy
 */

export interface IProductOption {
    name: string;
    values: string[]
}

export interface IProduct extends Document {
    name: string;
    description?: string;
    basePrice: number;
    options: IProductOption[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


const productOptionSchema = new mongoose.Schema<IProductOption>({
    name: {
        type: String,
        required: true
    },
    values: [{
        type: String,
        required: true
    }]
}, { _id: false })


const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    options: [productOptionSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })


export const Product = mongoose.model<IProduct>("Product", productSchema)