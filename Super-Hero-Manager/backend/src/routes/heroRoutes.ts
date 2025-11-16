import { Router } from 'express';
import { getAllHeroes , getHeroById , createHero , updateHero , deleteHero} from '../controllers/heroController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public routes
router.get('/', (req, res) => getAllHeroes(req, res));
router.get('/:id', getHeroById);

// Protected routes - require authentication
router.post('/', authenticate, authorizeRoles('admin', 'editor'), upload.single('image'), createHero);
router.put('/:id', authenticate, authorizeRoles('admin', 'editor'), upload.single('image'), updateHero);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteHero);

export default router;
