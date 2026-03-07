import { ApiError } from "../../utils/ApiError";
import { Product } from "./product.model";
import { CreateProductInput } from "./product.schema";




export class ProductService {
    /**
   * Create new product (Admin only)
   */

    static async createProduct(data: CreateProductInput) {
        const existing = await Product.findOne({ name: data.name })

        if (existing) {
            throw new ApiError(400, "Product already exists");
        }
        const product = await Product.create(data)

        return product
    }


    /**
   * Get all active products (Public)
   */
    static async getAllProduct() {
        return Product.find({ isActive: true })
    }


    /**
   * Get single product by ID
   */

    static async getProductById(id: string) {
        const product = await Product.findById(id)

        if (!product) {
            throw new ApiError(404, "Product not found")
        }


        return product
    }

}