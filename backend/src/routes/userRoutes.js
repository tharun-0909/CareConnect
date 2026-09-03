import { Router } from 'express';
import { listUsers, updateUserRole } from '../controllers/userController.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth, allowRoles('admin'));
router.get('/', listUsers);
router.patch('/:id/role', updateUserRole);
export default router;
