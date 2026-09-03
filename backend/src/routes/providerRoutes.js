import { Router } from 'express';
import { createProvider, createProviderFromUser, getMyProvider, getProvider, listProviders, updateMyProviderActivity, updateMyProviderLocation, updateProvider, updateProviderActivity } from '../controllers/providerController.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth); router.get('/', listProviders); router.get('/me', allowRoles('service_provider'), getMyProvider); router.patch('/me/activity', allowRoles('service_provider'), updateMyProviderActivity); router.patch('/me/location', allowRoles('service_provider'), updateMyProviderLocation); router.get('/:id', getProvider); router.post('/', allowRoles('admin'), createProvider); router.post('/from-user/:userId', allowRoles('admin'), createProviderFromUser); router.patch('/:id/activity', allowRoles('service_provider'), updateProviderActivity); router.patch('/:id', allowRoles('admin', 'service_provider'), updateProvider);
export default router;
