import { Router } from 'express';
import ServiceRequest from '../models/ServiceRequest.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';
const router = Router();
router.get('/overview', requireAuth, allowRoles('admin'), async (req, res) => { const [totalCustomers, totalProviders] = await Promise.all([User.countDocuments({ role: 'customer' }), User.countDocuments({ role: 'service_provider' })]); res.json({ totalCustomers, totalProviders }); });
export default router;
