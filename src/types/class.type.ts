import { Document, Types } from "mongoose";

export interface IClass extends Document {
    className: string;
    teacherId: Types.ObjectId;
    studentIds: Types.ObjectId[];
}