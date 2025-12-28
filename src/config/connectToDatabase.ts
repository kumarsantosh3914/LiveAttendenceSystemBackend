import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(serverConfig.MONGODB_URI);
        logger.info("Connected to database");
    } catch (error) {
        logger.error("Error connecting to database", error);
        throw error;
    }
}