import { Types } from "mongoose";
import { AttendenceRepository } from "../repositores/attendence.repository";
import { IAttendence } from "../types/Attendence.type";
import logger from "../config/logger.config";

/**
 * Uses dependency injection for better testability and maintainability
 */
export class AttendanceService {
    constructor(private readonly attendanceRepository: AttendenceRepository) {}

    /**
     * Create a new attendance record
     * 
     * @param attendanceData - Attendance data to create
     * @returns Created attendance document
     */
    async create(attendanceData: Partial<IAttendence>): Promise<IAttendence> {
        logger.info(`Creating attendance record for class ${attendanceData.classId}, student ${attendanceData.studentId}`);
        
        const newAttendance = await this.attendanceRepository.create(attendanceData);
        logger.info(`Attendance record created: ${newAttendance._id}`);
        return newAttendance;
    }

    /**
     * Get all attendance records
     * 
     * @returns Array of all attendance records
     */
    async findAll(): Promise<IAttendence[]> {
        logger.debug("Fetching all attendance records");
        return await this.attendanceRepository.findAll();
    }

    /**
     * Get attendance record by ID
     * 
     * @param id - Attendance record ID
     * @returns Attendance document or null if not found
     */
    async findById(id: string | Types.ObjectId): Promise<IAttendence | null> {
        logger.debug(`Fetching attendance by ID: ${id}`);
        return await this.attendanceRepository.findById(id);
    }

    /**
     * Update an attendance record
     * 
     * @param id - Attendance record ID
     * @param updateData - Data to update
     * @returns Updated attendance document or null if not found
     */
    async update(id: string | Types.ObjectId, updateData: Partial<IAttendence>): Promise<IAttendence | null> {
        logger.info(`Updating attendance ID: ${id}`);
        
        const updatedAttendance = await this.attendanceRepository.update(id, updateData);
        
        if (!updatedAttendance) {
            logger.warn(`Attendance not found for update: ${id}`);
        } else {
            logger.info(`Attendance updated successfully: ${id}`);
        }
        
        return updatedAttendance;
    }

    /**
     * Delete an attendance record
     * 
     * @param id - Attendance record ID
     * @returns Deleted attendance document or null if not found
     */
    async delete(id: string): Promise<IAttendence | null> {
        logger.info(`Deleting attendance ID: ${id}`);
        
        const deletedAttendance = await this.attendanceRepository.delete(id);
        
        if (!deletedAttendance) {
            logger.warn(`Attendance not found for deletion: ${id}`);
        } else {
            logger.info(`Attendance deleted successfully: ${id}`);
        }
        
        return deletedAttendance;
    }

    /**
     * Find all attendance records for a specific class
     * 
     * @param classId - Class ID
     * @returns Array of attendance records for the class
     */
    async findByClassId(classId: string | Types.ObjectId): Promise<IAttendence[]> {
        logger.debug(`Fetching attendance for class ID: ${classId}`);
        return await this.attendanceRepository.findByClassId(classId);
    }

    /**
     * Find all attendance records for a specific student
     * 
     * @param studentId - Student user ID
     * @returns Array of attendance records for the student
     */
    async findByStudentId(studentId: string | Types.ObjectId): Promise<IAttendence[]> {
        logger.debug(`Fetching attendance for student ID: ${studentId}`);
        return await this.attendanceRepository.findByStudentId(studentId);
    }

    /**
     * Find attendance record for a specific class and student
     * 
     * @param classId - Class ID
     * @param studentId - Student user ID
     * @returns Attendance document or null if not found
     */
    async findByClassAndStudent(
        classId: string | Types.ObjectId,
        studentId: string | Types.ObjectId
    ): Promise<IAttendence | null> {
        logger.debug(`Fetching attendance for class ${classId} and student ${studentId}`);
        return await this.attendanceRepository.findByClassAndStudent(classId, studentId);
    }

    /**
     * Mark attendance (create or update existing record)
     * 
     * @param classId - Class ID
     * @param studentId - Student user ID
     * @param status - Attendance status ("present" or "absent")
     * @returns Attendance document
     * @throws BadRequestError if IDs are invalid
     */
    async markAttendance(
        classId: string | Types.ObjectId,
        studentId: string | Types.ObjectId,
        status: "present" | "absent"
    ): Promise<IAttendence> {
        logger.info(`Marking attendance: ${status} for student ${studentId} in class ${classId}`);
        
        try {
            const attendance = await this.attendanceRepository.markAttendence(classId, studentId, status);
            logger.info(`Attendance marked successfully: ${attendance._id}`);
            return attendance;
        } catch (error) {
            logger.error("Failed to mark attendance", { error, classId, studentId, status });
            throw error;
        }
    }

    /**
     * Get attendance statistics for a class
     * 
     * @param classId - Class ID
     * @returns Statistics object with total, present, and absent counts
     */
    async getClassStatistics(classId: string | Types.ObjectId): Promise<{
        total: number;
        present: number;
        absent: number;
    }> {
        logger.debug(`Fetching attendance statistics for class ID: ${classId}`);
        return await this.attendanceRepository.getClassStatistics(classId);
    }

    /**
     * Find attendance records by date range
     * 
     * @param startDate - Start date
     * @param endDate - End date
     * @param classId - Optional class ID to filter by
     * @returns Array of attendance records within the date range
     */
    async findByDateRange(
        startDate: Date,
        endDate: Date,
        classId?: string | Types.ObjectId
    ): Promise<IAttendence[]> {
        logger.debug(`Fetching attendance from ${startDate} to ${endDate}${classId ? ` for class ${classId}` : ''}`);
        return await this.attendanceRepository.findByDateRange(startDate, endDate, classId);
    }
}

// Export singleton instance for convenience (can be replaced with DI container)
const attendanceRepository = new AttendenceRepository();
export const attendanceService = new AttendanceService(attendanceRepository);