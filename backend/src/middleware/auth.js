import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';

const normalizeRole = role => {
  if (['providers', 'provider', 'service_provider'].includes(role)) return 'service_provider';
  if (role === 'admin') return 'admin';
  return 'customer';
};

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    const currentUser = await User.findById(req.user.id).select('role name email');
    if (currentUser) {
      req.user.role = normalizeRole(currentUser.role);
      req.user.name = currentUser.name;
      req.user.email = currentUser.email;
    } else {
      req.user.role = normalizeRole(req.user.role);
    }
    next();
  } catch { res.status(401).json({ message: 'Invalid or expired token' }); }
}

export const allowRoles = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Insufficient permissions' });
