import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.config";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositores/user.repository";
import { StatusCodes } from "http-status-codes";

const userService = new UserService(new UserRepository());

export async function signupHandler(req: Request, res: Response, next: NextFunction) {
    logger.info("Signup request received");

    const response = await userService.signUp(req.body);

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User created successfully",
        data: response,
    });
}

export async function signinHandler(req: Request, res: Response, next: NextFunction) {
    logger.info("Signin request received");

    const response = await userService.signIn(req.body);

    res.status(StatusCodes.OK).json({
        success: true,
        message: "User signed in successfully",
        data: response,
    });
}