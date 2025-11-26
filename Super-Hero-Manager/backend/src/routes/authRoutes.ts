import express from 'express';
import { signup, login, logout, updateProfile, checkAuth, getAllUsers } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);

router.put('/update-profile', authenticate, updateProfile);

router.get("/check", authenticate, checkAuth);
router.get("/users", authenticate, authorizeRoles('admin'), getAllUsers);

export default router;