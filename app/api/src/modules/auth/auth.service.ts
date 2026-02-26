import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { LoginInput, SignupInput } from "./auth.schema";
import { IUser, User, UserRole } from "./auth.model";
import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";
import { Types } from "mongoose";


export class AuthService {
    //REGISTER USER
    static async signup(data: SignupInput): Promise<IUser> {
        const { name, email, password } = data

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: UserRole.USER
        })

        return user
    }


    //LOGIN USER
    static async login(data: LoginInput): Promise<{ user: IUser; token: string }> {
        const { email, password } = data


        /** Explicitly select password because it is excluded by default */
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new ApiError(401, "Invalid credentials")
        }

        const isPassMatch = await bcrypt.compare(password, user.password)
        if (!isPassMatch) {
            throw new ApiError(401, "Invalid credentials")
        }

        type JwtPayload = {
            id: Types.ObjectId;
            role: string;
        }

        const JwtPayload: JwtPayload = {
            id: user._id,
            role: user.role

        }

        const token = jwt.sign(JwtPayload,
            env.JWT_SECRET,
            {
                expiresIn: env.JWT_EXPIRES_IN
            }
        )

        return {
            user,
            token
        }
    }
}


