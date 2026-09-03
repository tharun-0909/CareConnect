import { Router } from 'express';
import { acceptNotification, listMyNotifications, rejectNotification } from '../controllers/notificationController.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, allowRoles('service_provider'));
router.get('/', listMyNotifications);
router.patch('/:id/accept', acceptNotification);
router.patch('/:id/reject', rejectNotification);
export default router;
