import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "student" | "teacher" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

