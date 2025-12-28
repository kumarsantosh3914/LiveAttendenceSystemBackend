import { UserRepository } from "../repositores/user.repository";
import { SignUpRequestDto, SignUpResponseDto, SignInRequestDto, SignInResponseDto, transformUserToResponse } from "../dto/user.dto";
import jwt, { SignOptions } from "jsonwebtoken";
import { serverConfig } from "../config";
import { Types } from "mongoose";
import logger from "../config/logger.config";
import { InternalServerError } from "../utils/errors/app.error";

/**
 * Constants for JWT token generation
 */
const JWT_ALGORITHM = "HS256";

/**
 * UserService handles business logic for user operations
 * Uses dependency injection for better testability and maintainability
 */
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    /**
     * Handles user signup process
     * Creates a new user, hashes the password, and returns user data with JWT token
     * 
     * @param userData - Validated user signup data (name, email, password, role)
     * @returns User data (without password) and JWT token
     * @throws ConflictError if user with email already exists
     * @throws InternalServerError if token generation fails
     */
    async signUp(userData: SignUpRequestDto): Promise<SignUpResponseDto> {
        logger.info(`Signup attempt for email: ${userData.email}`);

        try {
            // Create user with hashed password
            const user = await this.userRepository.signUp({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role || "student",
            });

            // Generate JWT token
            const token = this.generateToken(user);

            logger.info(`Signup successful for user ID: ${user._id}`);

            // Return user data (without password) and token
            return {
                user: transformUserToResponse(user),
                token,
            };
        } catch (error) {
            logger.error("Signup failed", { error, email: userData.email });
            throw error;
        }
    }

    /**
     * Handles user signin process
     * Validates credentials and returns user data with JWT token
     * 
     * @param userData - User signin data (email, password)
     * @returns User data (without password) and JWT token
     * @throws BadRequestError if user not found
     * @throws UnauthorizedError if password is invalid
     * @throws InternalServerError if token generation fails
     */
    async signIn(userData: SignInRequestDto): Promise<SignInResponseDto> {
        logger.info(`Signin attempt for email: ${userData.email}`);

        try {
            // Validate credentials
            const user = await this.userRepository.signIn(userData.email, userData.password);

            if (!user) {
                throw new Error("User authentication failed");
            }

            // Generate JWT token
            const token = this.generateToken(user);

            logger.info(`Signin successful for user ID: ${user._id}`);

            // Return user data (without password) and token
            return {
                user: transformUserToResponse(user),
                token,
            };
        } catch (error) {
            logger.error("Signin failed", { error, email: userData.email });
            throw error;
        }
    }

    /**
     * Generates a JWT token for the user
     * 
     * @param user - User document to generate token for
     * @returns JWT token string
     * @throws InternalServerError if token generation fails
     */
    private generateToken(user: { _id: unknown; email: string; role: string }): string {
        try {
            const userId = (user._id as Types.ObjectId).toString();
            const payload = {
                id: userId,
                email: user.email,
                role: user.role,
            };

            const options = {
                expiresIn: serverConfig.JWT_EXPIRES_IN,
                algorithm: JWT_ALGORITHM,
            } as SignOptions;

            const token = jwt.sign(payload, serverConfig.JWT_SECRET, options);
            logger.debug(`JWT token generated for user ID: ${userId}`);
            return token;
        } catch (error) {
            logger.error("Failed to generate JWT token", { error });
            throw new InternalServerError("Failed to generate authentication token");
        }
    }
}

// Export singleton instance for convenience (can be replaced with DI container)
const userRepository = new UserRepository();
export const userService = new UserService(userRepository);

/**
 * Convenience function for signup (maintains backward compatibility)
 * @deprecated Use UserService instance directly for better testability
 */
export async function signUpService(userData: SignUpRequestDto): Promise<SignUpResponseDto> {
    return userService.signUp(userData);
}