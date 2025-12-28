import BaseRepository from "./base.repository";
import { IUser } from "../types/user.type";
import User from "../models/User";
import { BadRequestError, ConflictError, UnauthorizedError } from "../utils/errors/app.error";
import bcrypt from "bcrypt";
import logger from "../config/logger.config";
import { serverConfig } from "../config";

/**
 * Constants for password hashing
 */
const SALT_ROUNDS = serverConfig.SALT_ROUNDS;

/**
 * UserRepository handles all database operations for User entities
 * Extends BaseRepository to provide common CRUD operations
 */
export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

    /**
     * Creates a new user with email uniqueness check and password hashing
     * 
     * @param userData - User data to create (password will be hashed)
     * @returns Created user document
     * @throws ConflictError if user with email already exists
     * @throws Error if password hashing fails
     */
    async signUp(userData: Partial<IUser>): Promise<IUser> {
        if (!userData.email) {
            throw new Error("Email is required for signup");
        }

        logger.info(`Checking if user with email ${userData.email} already exists`);
        const existingUser = await this.exists({ email: userData.email });
        
        if (existingUser) {
            logger.warn(`Signup attempt with existing email: ${userData.email}`);
            throw new ConflictError("User with this email already exists");
        }

        // Hash password before saving
        if (userData.password) {
            try {
                logger.debug("Hashing password for new user");
                userData.password = await bcrypt.hash(userData.password, SALT_ROUNDS);
            } catch (error) {
                logger.error("Failed to hash password", { error });
                throw new Error("Failed to process password");
            }
        } else {
            throw new Error("Password is required for signup");
        }

        logger.info(`Creating new user with email: ${userData.email}`);
        try {
            const user = await this.create(userData);
            logger.info(`User created successfully with ID: ${user._id}`);
            return user;
        } catch (error) {
            logger.error("Failed to create user", { error, email: userData.email });
            throw error;
        }
    }

    /**
     * Finds a user by email
     * 
     * @param email - Email address to search for
     * @returns User document or null if not found
     */
    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email: email.toLowerCase() });
    }

    async signIn(email: string, password: string): Promise<IUser | null> {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new BadRequestError("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid password");
        }
        return user;
    }
}