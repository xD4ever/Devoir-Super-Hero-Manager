//Import from packages
import express from 'express';
import dotenv from 'dotenv';
//import cookieParser from 'cookie-parser';
import cors from "cors";

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
//app.use(cookieParser());
app.use(cors(
  {
  origin: "http://localhost:5173",
  credentials: true,
  }
))

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