import { Types } from "mongoose";
import { ClassRepository } from "../repositores/class.respository";
import { IClass } from "../types/class.type";
import logger from "../config/logger.config";

export class ClassService {
    constructor(private readonly classRepository: ClassRepository) {}

    async create(classData: Partial<IClass>): Promise<IClass> {
        logger.info(`Creating new class ${classData.className}`);

        const newClass = await this.classRepository.create(classData);
        logger.info(`Class created: ${newClass._id}`);
        return newClass;
    }

    async findAll(): Promise<IClass[]> {
        logger.debug("Fetching all classes");
        return await this.classRepository.findAll();
    }

    async findById(id: string | Types.ObjectId): Promise<IClass | null> {
        logger.debug(`fetching class by ID: ${id}`);
        return await this.classRepository.findById(id);
    }

    async update(id: string | Types.ObjectId, updateData: Partial<IClass>): Promise<IClass | null> {
        logger.info(`Updating class ID: ${id}`);

        const updatedClass = await this.classRepository.update(id, updateData);

        if(!updatedClass) {
            logger.warn(`Class not found for update: ${id}`);
        } else {
            logger.info(`Class updated successfully: ${id}`);
        }

        return updatedClass;
    }

    async delete(id: string): Promise<IClass | null> {
        logger.info(`Deleting class ID: ${id}`);

        const deleteClass = await this.classRepository.delete(id);

        if(!deleteClass) {
            logger.warn(`Class not found for deletion: ${id}`);
        } else {
            logger.info(`Class deleted successfully`);
        }

        return deleteClass;
    }

    async findByTeacherId(teacherId: string | Types.ObjectId): Promise<IClass[]> {
        return await this.classRepository.findByTeacherId(teacherId);
    }

    async findByStudentId(studentId: string | Types.ObjectId): Promise<IClass[]> {
        logger.debug(`Fetching classes for student ID: ${studentId}`);
        return await this.classRepository.findByStudentId(studentId);
    }

    async addStudent(classId: string | Types.ObjectId, studentId: string | Types.ObjectId): Promise<IClass | null> {
        return await this.classRepository.addStudent(classId, studentId);
    }

    async removeStudent(classId: string | Types.ObjectId, studentId: string | Types.ObjectId): Promise<IClass | null> {
        return await this.classRepository.removeStudent(classId, studentId);
    }

    async findByIdWithPopulate(id: string | Types.ObjectId): Promise<IClass | null> {
        return await this.classRepository.findByIdWithPopulate(id);
    }

    async isStudentEnrolled(classId: string | Types.ObjectId, studentId: string | Types.ObjectId): Promise<boolean> {
        return await this.classRepository.isStudentEnrolled(classId, studentId);
    }
}

const classRepository = new ClassRepository();
export const classService = new ClassService(classRepository);