import mongoose from "mongoose";
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONDODB_URI || '');
        console.log(`MongoDB connected: ${conn.connection.host}`);
        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        logger.error("MongoDB connection error:", error);
        process.exit(1);
    }
};