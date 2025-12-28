import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors/app.error";
import jwt from "jsonwebtoken";
import { serverConfig } from "../config";
import logger from "../config/logger.config";
import { UserRepository } from "../repositores/user.repository";


export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            throw new UnauthorizedError("Authorization header is missing");
        }

        // Check if it's Bearer format
        if(!authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Invalid authorization header format.");
        }

        // Extract token (remove "Bearer " prefix)
        const token = authHeader.substring(7);

        if(!token) {
            throw new UnauthorizedError("Token is missing");
        }

        // Verify and decode the token
        let decoded: any;
        try {
            decoded = jwt.verify(token, serverConfig.JWT_SECRET);
        } catch (error) {
            logger.warn("Invalid or expired token", {error});
            throw new UnauthorizedError("Invalid or expired token");
        }

        // Extract user info from token
        const {id, email, role } = decoded;

        if(!id || !email || !role) {
            throw new UnauthorizedError("Invalid token payload");
        }

        // Optionally: Fetch full user document from db
        // This ensures the user still exists and is active
        const userRepository = new UserRepository();
        const user = await userRepository.findById(id);

        if(!user) {
            throw new UnauthorizedError("User not found");
        }

        req.user = { id, email, role };
        req.userDocument = user;

        logger.debug("User authenticated", { userId: id, email });
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Role-based authorization middleware
 * Use after authenticate middleware to check user roles
 * 
 * @param allowedRoles - Array of allowed roles
 * @returns Middleware function
 */
export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw new UnauthorizedError("User not authenticated");
        }

        if (!allowedRoles.includes(req.user.role)) {
            logger.warn("Access denied - insufficient permissions", {
                userId: req.user.id,
                userRole: req.user.role,
                requiredRoles: allowedRoles,
            });
            throw new UnauthorizedError("Insufficient permissions");
        }

        next();
    };
}