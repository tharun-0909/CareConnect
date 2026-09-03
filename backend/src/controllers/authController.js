import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import { config } from '../config/env.js';

const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role });
const tokenFor = user => jwt.sign({ id: user._id, role: user.role, name: user.name }, config.jwtSecret, { expiresIn: '7d' });
export async function register(req, res) { const { name, email, password, role } = req.body; const allowedRoles = ['customer', 'service_provider']; if (!name || !email || !password || !role) return res.status(400).json({ message: 'Name, email, password and role are required' }); if (!allowedRoles.includes(role)) return res.status(400).json({ message: 'Choose Customer or Service Provider' }); try { const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role }); if (role === 'service_provider') await Provider.create({ user: user._id, name, initials: name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(), specialty: 'Home services provider', location: 'Service area' }); res.status(201).json({ token: tokenFor(user), user: publicUser(user) }); } catch (error) { res.status(400).json({ message: error.code === 11000 ? 'Email already registered' : error.message }); } }
export async function login(req, res) { const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+password'); if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' }); if (user.role === 'service_provider') await Provider.findOneAndUpdate({ user: user._id }, { $setOnInsert: { user: user._id, name: user.name, initials: user.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(), specialty: 'Home services provider', location: 'Service area', isActive: false } }, { upsert: true, new: true }); res.json({ token: tokenFor(user), user: publicUser(user) }); }
export async function me(req, res) { res.json(await User.findById(req.user.id).select('-password')); }
