//Import from packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';

//Import from files
import authRoutes from './routes/authRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();

//Server Information
const PORT = process.env.PORT;
const IP = process.env.IP;

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
  origin: "http://localhost:3000",
  credentials: true,
  }
))

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'src', 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);

const startServer = async () => {
  await connectDB();
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on http://${IP}:${PORT}`);
    logger.info(`Server is running on http://${IP}:${PORT}`);
  });
};

startServer();