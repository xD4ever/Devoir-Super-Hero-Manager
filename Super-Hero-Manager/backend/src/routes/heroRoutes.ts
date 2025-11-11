import { Router } from 'express';
import { getAllHeroes , getHeroById , createHero , updateHero , deleteHero} from '../controllers/heroController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public routes
router.get('/', getAllHeroes);
router.get('/:id', getHeroById);

// Protected routes - require authentication
router.post('/', authenticate, authorize(['admin', 'editor']), upload.single('image'), createHero);
router.put('/:id', authenticate, authorize(['admin', 'editor']), upload.single('image'), updateHero);
router.delete('/:id', authenticate, authorize(['admin']), deleteHero);

export default router;
