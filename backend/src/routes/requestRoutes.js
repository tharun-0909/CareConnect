import { Router } from 'express';
import { assignProvider, completeRequest, createRequest, listRequests, updateRequestStatus } from '../controllers/requestController.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth); router.get('/', listRequests); router.post('/', createRequest); router.patch('/:id/provider', allowRoles('customer'), assignProvider); router.patch('/:id/complete', allowRoles('admin', 'customer'), completeRequest); router.patch('/:id/status', allowRoles('admin', 'customer', 'service_provider'), updateRequestStatus);
export default router;
