import mongoose from "mongoose";
import { IClass } from "../types/class.type";

const classSchema = new mongoose.Schema<IClass>({
    className: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
    },
    studentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
    }],
}, { timestamps: true });

const Class = mongoose.model<IClass>("Class", classSchema);

export default Class;