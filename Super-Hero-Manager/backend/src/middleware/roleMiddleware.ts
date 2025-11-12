import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';


export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            if (!user) {
                logger.warn('Authorization failed: No user found in request');
                return res.status(401).json({ message: 'Unauthorized - No user found' });
            }
            if (!allowedRoles.includes(user.role)) {
                logger.warn(`Authorization failed: User role ${user.role} not allowed`);
                return res.status(403).json({ message: 'Forbidden - You do not have access to this resource' });
            }
            return next();
        } catch (error: any) {
            console.log("Error in authorizeRoles middleware: ", error.message);
            logger.error("Error in authorizeRoles middleware: ", error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};