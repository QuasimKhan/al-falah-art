import express from "express"
import cors from "cors"
import authRoutes from "./modules/auth/auth.routes"
import productRoutes from "./modules/products/product.routes"
import { errorMiddleware } from "./middlewares/error.middleware"
import morgan from "morgan"

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'));



app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)


app.get("/health", function (_req, res) {
    res.status(200).json({
        success: true,
        message: "Health is good"
    })
})
app.use(errorMiddleware)

export default app