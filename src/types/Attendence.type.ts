import { Document, Types } from "mongoose";

export interface IAttendence extends Document {
    classId: Types.ObjectId;
    studentId: Types.ObjectId;
    status: "present" | "absent"
}