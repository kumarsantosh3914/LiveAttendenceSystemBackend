import { Types } from "mongoose";
import Class from "../models/class";
import { IClass } from "../types/class.type";
import BaseRepository from "./base.repository";
import { BadRequestError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export class ClassRepository extends BaseRepository<IClass> {
    constructor() {
        super(Class);
    }

    async findByTeacherId(teacherId: string | Types.ObjectId): Promise<IClass[]> {
        return await Class.find({ teacherId }).populate('teacherId', 'name email').populate('studentIds', 'name email');
    }

    async findByStudentId(studentId: string | Types.ObjectId): Promise<IClass[]> {
        return await Class.find({ studentIds: studentId }).populate('teacherId', 'name email');
    }

    async addStudent(classId: string | Types.ObjectId, studentId: string | Types.ObjectId): Promise<IClass | null> {
        if(!Types.ObjectId.isValid(classId) || !Types.ObjectId.isValid(studentId)) {
            throw new BadRequestError("Invalid ID format");
        }

        const classDoc = await Class.findById(classId);
        if(!classDoc) {
            throw new BadRequestError("Class not found");
        }

        // Check if student already exits
        if(classDoc.studentIds.includes(studentId as Types.ObjectId)) {
            logger.warn(`Student ${studentId} already enrolled in class ${classId}`);
            return classDoc;
        }

        classDoc.studentIds.push(studentId as Types.ObjectId);
        return await classDoc.save();
    }

    async removeStudent(classId: string | Types.ObjectId, studentId: string | Types.ObjectId): Promise<IClass | null> {
        if(!Types.ObjectId.isValid(classId) || !Types.ObjectId.isValid(studentId)) {
            throw new BadRequestError("Invalid ID format");
        }

        return await Class.findByIdAndUpdate(
            classId,
            { $pull: { studentIds: studentId } },
            { new: true }
        );
    }

    async findByIdWithPopulate(id: string | Types.ObjectId): Promise<IClass | null> {
        if(!Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Invalid ID format");
        }

        return await Class.findById(id)
            .populate('teacherId', 'name email role')
            .populate('studentIds', 'name email role')
    }

    async isStudentEnrolled(classId: string | Types.ObjectId, studentId: string | Types.ObjectId): Promise<boolean> {
        const classDoc = await Class.findById(classId);
        if(!classDoc) {
            return false;
        }

        return classDoc.studentIds.some(id => id.toString() === studentId.toString());
    }
}