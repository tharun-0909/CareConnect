import { Router } from 'express';
import { createReview, listReviews } from '../controllers/reviewController.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listReviews);
router.post('/', allowRoles('customer'), createReview);
export default router;