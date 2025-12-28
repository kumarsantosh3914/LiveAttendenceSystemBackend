/// <reference path="../types/express.d.ts" />

import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.config";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositores/user.repository";
import { StatusCodes } from "http-status-codes";

const userService = new UserService(new UserRepository());

export async function signupHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        logger.info("Signup request received");

        const { user, token } = await userService.signUp(req.body);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User created successfully",
            user,
            token,
        });
    } catch (error) {
        next(error);
    }
}

export async function signinHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        logger.info("Signin request received");

        const { user, token } = await userService.signIn(req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "User signed in successfully",
            user,
            token,
        });
    } catch (error) {
        next(error);
    }
}

export async function getProfileHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        res.status(StatusCodes.OK).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
}