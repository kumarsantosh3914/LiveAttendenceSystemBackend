import { IUser } from "../types/user.type";
import { Types } from "mongoose";

/**
 * DTO for user signup request
 * This should match the Zod validation schema
 */
export interface SignUpRequestDto {
    name: string;
    email: string;
    password: string;
    role?: "student" | "teacher" | "admin";
}

/**
 * DTO for user signin request
 */
export interface SignInRequestDto {
    email: string;
    password: string;
}

/**
 * DTO for user signup response
 * Excludes sensitive information like password
 */
export interface SignUpResponseDto {
    user: UserResponseDto;
    token: string;
}

/**
 * DTO for user signin response
 * Same structure as signup response
 */
export interface SignInResponseDto {
    user: UserResponseDto;
    token: string;
}

/**
 * DTO for user response (used in multiple endpoints)
 * Excludes sensitive information like password
 */
export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: "student" | "teacher" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Transforms IUser document to UserResponseDto
 * Excludes sensitive information like password and internal MongoDB fields
 * 
 * @param user - User document from database
 * @returns UserResponseDto with safe user data
 */
export function transformUserToResponse(user: IUser): UserResponseDto {
    const userId = user._id;
    
    if (!userId) {
        throw new Error("User ID is missing");
    }

    return {
        id: (userId as Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

