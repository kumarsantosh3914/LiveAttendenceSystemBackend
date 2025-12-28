/// <reference path="../types/express.d.ts" />

import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.config";
import { attendanceService } from "../services/attendence.service";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../utils/errors/app.error";

export async function createAttendanceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        logger.info("Create attendance request received");

        const newAttendance = await attendanceService.create(req.body);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Attendance record created successfully",
            data: newAttendance,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllAttendanceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        logger.info("Get all attendance request received");

        const attendanceRecords = await attendanceService.findAll();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Attendance records retrieved successfully",
            data: attendanceRecords,
            count: attendanceRecords.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAttendanceByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        logger.info(`Get attendance by ID request received: ${id}`);

        const attendance = await attendanceService.findById(id);

        if (!attendance) {
            throw new NotFoundError("Attendance record not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Attendance record retrieved successfully",
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateAttendanceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        logger.info(`Update attendance request received: ${id}`);

        const updatedAttendance = await attendanceService.update(id, req.body);

        if (!updatedAttendance) {
            throw new NotFoundError("Attendance record not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Attendance record updated successfully",
            data: updatedAttendance,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteAttendanceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        logger.info(`Delete attendance request received: ${id}`);

        const deletedAttendance = await attendanceService.delete(id);

        if (!deletedAttendance) {
            throw new NotFoundError("Attendance record not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Attendance record deleted successfully",
            data: deletedAttendance,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAttendanceByClassHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { classId } = req.params;
        logger.info(`Get attendance by class request received: ${classId}`);

        const attendanceRecords = await attendanceService.findByClassId(classId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Attendance records retrieved successfully",
            data: attendanceRecords,
            count: attendanceRecords.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAttendanceByStudentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { studentId } = req.params;
        logger.info(`Get attendance by student request received: ${studentId}`);

        const attendanceRecords = await attendanceService.findByStudentId(studentId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Attendance records retrieved successfully",
            data: attendanceRecords,
            count: attendanceRecords.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAttendanceByClassAndStudentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { classId, studentId } = req.params;
        logger.info(`Get attendance by class and student request received: class ${classId}, student ${studentId}`);

        const attendance = await attendanceService.findByClassAndStudent(classId, studentId);

        if (!attendance) {
            throw new NotFoundError("Attendance record not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Attendance record retrieved successfully",
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
}

export async function markAttendanceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { classId, studentId } = req.params;
        const { status } = req.body;
        logger.info(`Mark attendance request received: class ${classId}, student ${studentId}, status ${status}`);

        if (!status || !["present", "absent"].includes(status)) {
            throw new BadRequestError("Status must be 'present' or 'absent'");
        }

        const attendance = await attendanceService.markAttendance(classId, studentId, status);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Attendance marked successfully",
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
}

export async function getClassStatisticsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { classId } = req.params;
        logger.info(`Get class statistics request received: ${classId}`);

        const statistics = await attendanceService.getClassStatistics(classId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Statistics retrieved successfully",
            data: statistics,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAttendanceByDateRangeHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { startDate, endDate } = req.query;
        const { classId } = req.params;
        logger.info(`Get attendance by date range request received: ${startDate} to ${endDate}`);

        if (!startDate || !endDate) {
            throw new BadRequestError("Start date and end date are required");
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestError("Invalid date format");
        }

        const attendanceRecords = await attendanceService.findByDateRange(
            start,
            end,
            classId || undefined
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Attendance records retrieved successfully",
            data: attendanceRecords,
            count: attendanceRecords.length,
        });
    } catch (error) {
        next(error);
    }
}