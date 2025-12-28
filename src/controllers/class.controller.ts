/// <reference path="../types/express.d.ts" />

import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.config";
import { classService } from "../services/class.service";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../utils/errors/app.error";

export async function createClassHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        logger.info("Create class request received");

        const newClass = await classService.create(req.body);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Class created successfully",
            data: newClass,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllClassesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        logger.info("Get all classes request received");

        const classes = await classService.findAll();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Classes retrieved successfully",
            data: classes,
            count: classes.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function getClassByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        logger.info(`Get class by ID request received: ${id}`);

        const classDoc = await classService.findById(id);

        if (!classDoc) {
            throw new NotFoundError("Class not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Class retrieved successfully",
            data: classDoc,
        });
    } catch (error) {
        next(error);
    }
}

export async function getClassWithDetailsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        logger.info(`Get class with details request received: ${id}`);

        const classDoc = await classService.findByIdWithPopulate(id);

        if (!classDoc) {
            throw new NotFoundError("Class not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Class retrieved successfully",
            data: classDoc,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateClassHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        logger.info(`Update class request received: ${id}`);

        const updatedClass = await classService.update(id, req.body);

        if (!updatedClass) {
            throw new NotFoundError("Class not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Class updated successfully",
            data: updatedClass,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteClassHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        logger.info(`Delete class request received: ${id}`);

        const deletedClass = await classService.delete(id);

        if (!deletedClass) {
            throw new NotFoundError("Class not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Class deleted successfully",
            data: deletedClass,
        });
    } catch (error) {
        next(error);
    }
}

export async function getClassesByTeacherHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { teacherId } = req.params;
        logger.info(`Get classes by teacher request received: ${teacherId}`);

        const classes = await classService.findByTeacherI(teacherId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Classes retrieved successfully",
            data: classes,
            count: classes.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function getClassesByStudentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { studentId } = req.params;
        logger.info(`Get classes by student request received: ${studentId}`);

        const classes = await classService.findByStudentId(studentId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Classes retrieved successfully",
            data: classes,
            count: classes.length,
        });
    } catch (error) {
        next(error);
    }
}

export async function addStudentToClassHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id: classId } = req.params;
        const { studentId } = req.body;
        logger.info(`Add student to class request received: class ${classId}, student ${studentId}`);

        if (!studentId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Student ID is required",
            });
            return;
        }

        const updatedClass = await classService.addStudent(classId, studentId);

        if (!updatedClass) {
            throw new NotFoundError("Class not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Student added to class successfully",
            data: updatedClass,
        });
    } catch (error) {
        next(error);
    }
}

export async function removeStudentFromClassHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id: classId, studentId } = req.params;
        logger.info(`Remove student from class request received: class ${classId}, student ${studentId}`);

        const updatedClass = await classService.removeStudent(classId, studentId);

        if (!updatedClass) {
            throw new NotFoundError("Class not found");
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Student removed from class successfully",
            data: updatedClass,
        });
    } catch (error) {
        next(error);
    }
}