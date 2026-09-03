import User from '../models/User.js';
import Provider from '../models/Provider.js';

export async function listUsers(req, res) { res.json(await User.find().select('-password').sort({ createdAt: -1 })); }
export async function updateUserRole(req, res) { const allowed = ['admin', 'customer', 'service_provider']; if (!allowed.includes(req.body.role)) return res.status(400).json({ message: 'Invalid role' }); const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true }).select('-password'); if (!user) return res.status(404).json({ message: 'User not found' }); if (req.body.role === 'service_provider') await Provider.findOneAndUpdate({ user: user._id }, { $setOnInsert: { user: user._id, name: user.name, initials: user.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(), specialty: 'Home services provider', location: 'Service area', skills: [], verified: false } }, { upsert: true, new: true }); res.json(user); }
