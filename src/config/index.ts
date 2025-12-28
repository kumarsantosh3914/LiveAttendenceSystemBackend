// This file contains all the basic configuration for the app server to work
import dotenv from 'dotenv';
import logger from './logger.config';

type ServerConfig = {
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    SALT_ROUNDS: number;
}

/**
 * Validates that required environment variables are present
 * @throws Error if required env vars are missing
 */
function validateEnvVars(): void {
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
    const missingVars: string[] = [];

    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    }

    if (missingVars.length > 0) {
        const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    // Validate JWT_SECRET strength in production
    if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET) {
        const secret = process.env.JWT_SECRET;
        if (secret.length < 32) {
            logger.warn('JWT_SECRET is less than 32 characters. Consider using a stronger secret in production.');
        }
        if (secret === 'your-secret-key-change-in-production') {
            throw new Error('JWT_SECRET must be changed from default value in production');
        }
    }
}

function loadEnv() {
    dotenv.config();
    logger.info('Environment variables loaded from .env file');
    validateEnvVars();
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3000,
    MONGODB_URI: String(process.env.MONGODB_URI),
    JWT_SECRET: String(process.env.JWT_SECRET),
    JWT_EXPIRES_IN: String(process.env.JWT_EXPIRES_IN) || "7d",
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
}