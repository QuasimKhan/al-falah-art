import mongoose, { Document, Schema } from "mongoose";


/** 
 * - UserRole Type - ADMIN | USER
**/
export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: [6, "Password is required"],
        select: false /** Prevent password from being returned by default */
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },

}, {
    timestamps: true,
    toJSON: {
        transform(_doc, ret) {
            const { password, __v, ...result } = ret;
            return result;
        }
    }

})


export const User = mongoose.model<IUser>("User", userSchema)

