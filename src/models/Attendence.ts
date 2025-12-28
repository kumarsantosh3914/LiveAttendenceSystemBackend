import mongoose from "mongoose";
import { IAttendence } from "../types/Attendence.type";

const attendenceSchema = new mongoose.Schema<IAttendence> ({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ["present", "absent"],
        default: "absent",
        required: true
    }
}, { timestamps: true });

const Attendence = mongoose.model<IAttendence>("Attendence", attendenceSchema);

export default Attendence;