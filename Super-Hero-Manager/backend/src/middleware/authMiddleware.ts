import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check for token in cookies or Authorization header
        let token = req.cookies?.jwt;
        
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if (!token){
            return res.status(401).json({message: "Unauthorized - No Token Provided" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined in environment');
            logger.error('JWT_SECRET is not defined in environment');
            return res.status(500).json({ message: 'Internal server error' });
        }

        const decoded = jwt.verify(token, secret);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Token invalid" });
        }

        const user = await User.findById((decoded as any).userId).select('-passwordHashed');
        if (!user){
            return res.status(404).json({message: "User not found" });
        }

        (req as any).user = user;

        return next();

    }catch (error :any) {
        console.log("Error in authenticate middleware: ", error.message)
        logger.error("Error in authenticate middleware: ", error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
