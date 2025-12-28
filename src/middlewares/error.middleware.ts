import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/errors/app.error";
import { ZodError } from "zod";
import logger from "../config/logger.config";

/**
 * Error handler for application-specific errors (AppError)
 * Handles errors that implement the AppError interface
 */
export const appErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // Check if error is an AppError with statusCode
    const appError = err as AppError;
    
    if (appError.statusCode) {
        logger.error("Application error", { 
            statusCode: appError.statusCode, 
            message: appError.message,
            name: appError.name 
        });
        
        res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
        });
        return;
    }
    
    // If not an AppError, pass to next error handler
    next(err);
}

/**
 * Generic error handler for all other errors
 * Handles Zod validation errors, generic errors, and unknown errors
 */
export const genericErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error("Unhandled error", { error: err });
    
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation error",
            errors: err.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }
    
    // Handle AppError that might have been missed
    const appError = err as AppError;
    if (appError.statusCode) {
        res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
        });
        return;
    }
    
    // Handle generic errors
    const statusCode = (err as any).statusCode || 500;
    const message = err.message || "Internal server error";
    
    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? "Internal server error" 
            : message,
    });
}