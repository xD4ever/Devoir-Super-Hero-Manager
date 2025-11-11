import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (userId : Object, res: Response) => {

    const token = jwt.sign({userId}, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    });
    
    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,//prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV !== 'production',// Use secure cookies in production (HTTPS)
        sameSite: 'strict',// helps to prevent CSRF attacks
    });

    return token;
}