import { Router } from 'express';
import { emailExists, googleAuth, login, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.post('/register', register); router.post('/login', login); router.post('/google', googleAuth); router.get('/email-exists', emailExists); router.get('/me', requireAuth, me);
export default router;
