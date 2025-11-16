import { Request, Response } from 'express';
import { generateToken } from '../utils/tokkenGeneration';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

export const signup = async (req: Request, res: Response) => {
    //define the content of the http request
    const {username, password, role} = req.body;

    try {
        //Verifier si l'utilisateur existe deja
        const existingUser = await User.findOne({username});
        if (existingUser) {
            logger.warn(`Signup failed: User ${username} already exists`);
            return res.status(400).json({message: 'User already exists'});
        }
        //Verifier la formule du mot de passe
        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            logger.warn(`Signup failed: Weak password for user ${username}`);
            return res.status(400).json({message: 'Mot de passe trop faible.'});
        }

        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //creer un nouvel utilisateur
        const newUser = new User({
            username,
            passwordHashed: hashedPassword,
            role: role || 'user' //default role is editor,
        });

        if (newUser) {
            await newUser.save();
            //generate token
            const token = generateToken(newUser._id, res);
            logger.info(`User ${username} created successfully with role ${role || 'user'}`);
            return res.status(201).json({message: 'User created successfully', token});
        } else {
            logger.error(`Failed to create user ${username}`);
            return res.status(400).json({message: 'User not created'});
        }
    }catch(error) {
        logger.error('Signup error:', error);
        return res.status(500).json({message: 'Server error', error});
    }
}

export const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    try {
        //verifier si l'utilisateur existe
        const user = await User.findOne({username});
        if (!user) {
            logger.warn(`Login failed: User ${username} not found`);
            return res.status(400).json({message: 'Invalid credentials'});
        }

        //comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.passwordHashed);
        if (!isMatch) {
            logger.warn(`Login failed: Invalid password for user ${username}`);
            return res.status(400).json({message: 'Invalid credentials'});
        }

        //generate token
        const token = generateToken(user._id, res);
        logger.info(`User ${username} logged in successfully`);
        return res.status(200).json({message: 'Login successful', token});
    }catch(error) {
        logger.error('Login error:', error);
        return res.status(500).json({message: 'Server error', error});
    }
}

export const logout = async (_req: Request, res: Response) => {
    try {
        res.clearCookie('jwt');
        logger.info('User logged out successfully');
        return res.status(200).json({message: 'Logout successful'});
    } catch (error) {
        logger.error('Logout error:', error);
        return res.status(500).json({message: 'Server error', error});
    }
}

export const updateProfile = async (req: Request, res: Response) => {
   try {
    const user = (req as any).user;
    if (!user || !user._id) {
      logger.warn('Update profile failed: Unauthorized access');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = user._id;
    const { username, password } = req.body;
    const updateData: any = {};
    if (username) {
      updateData.username = username;
    }
    if (password) {
        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            logger.warn(`Update profile failed: Weak password for user ${username || userId}`);
            return res.status(400).json({message: 'Mot de passe trop faible.'});
        }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.passwordHashed = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-passwordHashed'); // Exclude password from the returned user

    logger.info(`User ${updatedUser?.username || userId} profile updated successfully`);
    return res.status(200).json(updatedUser)
    
  } catch (error : Error | any) {
    logger.error("Error in update profile:", error.message);
    return res.status(500).json({message: "Internal server error"})
  }
}

export const checkAuth = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user || !user._id) {
        logger.warn('CheckAuth failed: Unauthorized access');
        return res.status(401).json({ message: 'Unauthorized' });
      }
      logger.info(`Auth check successful for user ${user.username || user._id}`);
      return res.status(200).json({ message: 'Authorized', user });
    } catch (error: any) {
      logger.error("Error in checkAuth:", error?.message || error);
      return res.status(500).json({ message: "Internal server error" });
    }
}