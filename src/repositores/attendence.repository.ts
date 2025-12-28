import { Types } from "mongoose";
import Attendence from "../models/Attendence";
import { IAttendence } from "../types/Attendence.type";
import BaseRepository from "./base.repository";

export class AttendenceRepository extends BaseRepository<IAttendence> {
    constructor() {
        super(Attendence);
    }

    async findByClassId(classId: string | Types.ObjectId): Promise<IAttendence[]> {
        return await Attendence.find({ classId })
            .populate('classId', 'className')
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });
    }

    async findByStudentId(studentId: string | Types.ObjectId): Promise<IAttendence[]> {
        return await Attendence.find({ studentId })
            .populate('classId', 'className')
            .populate('studentId', 'name, email')
            .sort({ createdAt: -1 });
    }

    async findByClassAndStudent(classId: string | Types.ObjectId, studentId: string | Types.ObjectId): Promise<IAttendence | null> {
        return await Attendence.findOne({ classId, studentId, })
            .populate('classId', 'className')
            .populate('studentId', 'name, email')
            .sort({ createdAt: -1 });
    }

    async markAttendence(classId: string | Types.ObjectId, studentId: string | Types.ObjectId, status: "present" | "absent"): Promise<IAttendence> {
        if (!Types.ObjectId.isValid(classId) || !Types.ObjectId.isValid(studentId)) {
            throw new Error("Invalid ID format");
        }

        const existing = await Attendence.findOne({ classId, studentId });

        if (existing) {
            existing.status = status;
            return await existing.save();
        }

        return await this.create({ classId, studentId, status } as Partial<IAttendence>);
    }

    async getClassStatistics(classId: string | Types.ObjectId): Promise<{ total: number; present: number; absent: number }> {
        const total = await Attendence.countDocuments({ classId });
        const present = await Attendence.countDocuments({ classId, status: 'present' });
        const absent = await Attendence.countDocuments({ classId, status: 'absent' });

        return {
            total,
            present,
            absent
        }
    }

    async findByDateRange(startDate: Date, endDate: Date, classId?: string | Types.ObjectId): Promise<IAttendence[]> {
        const query: any = {
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };

        if(classId) {
            query.classId = classId;
        }

        return await Attendence.find(query)
            .populate('classId', 'className')
            .populate('studentId', 'name, email')
            .sort({ createdAt: -1 });
    }
}