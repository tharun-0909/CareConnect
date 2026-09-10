import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import { config } from '../config/env.js';
import { verifyGoogleIdToken } from '../utils/googleVerify.js';

const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, googleVerified: user.googleVerified });
const tokenFor = user => jwt.sign({ id: user._id, role: user.role, name: user.name }, config.jwtSecret, { expiresIn: '7d' });
export async function register(req, res) { const { name, email, password, role, googleToken } = req.body; const allowedRoles = ['customer', 'service_provider']; if (!name || !email || !password || !role) return res.status(400).json({ message: 'Name, email, password and role are required' }); if (!allowedRoles.includes(role)) return res.status(400).json({ message: 'Choose Customer or Service Provider' }); if (!googleToken) return res.status(400).json({ message: 'Google verification is required. Click the Verify with Google button to verify your account before registering.' }); let googleVerified = false; try { const verified = await verifyGoogleIdToken(googleToken, config.googleClientId); if (verified.email.toLowerCase() !== String(email).toLowerCase()) return res.status(400).json({ message: 'The Google account you verified does not match the email you entered.' }); googleVerified = true; } catch (googleError) { return res.status(401).json({ message: googleError.message || 'Google verification failed. Please use a valid Google account.' }); } try { const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role, googleVerified }); if (role === 'service_provider') await Provider.create({ user: user._id, name, initials: name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(), specialty: 'Home services provider', location: 'Service area' }); res.status(201).json({ token: tokenFor(user), user: publicUser(user) }); } catch (error) { res.status(400).json({ message: error.code === 11000 ? 'Email already registered' : error.message }); } }
export async function login(req, res) { const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+password'); if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' }); if (user.role === 'service_provider') await Provider.findOneAndUpdate({ user: user._id }, { $setOnInsert: { user: user._id, name: user.name, initials: user.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(), specialty: 'Home services provider', location: 'Service area', isActive: false } }, { upsert: true, new: true }); res.json({ token: tokenFor(user), user: publicUser(user) }); }
export async function googleAuth(req, res) {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'Google credential is required' });
  let verified;
  try {
    verified = await verifyGoogleIdToken(credential, config.googleClientId);
  } catch (googleError) {
    return res.status(401).json({ message: googleError.message || 'Google verification failed' });
  }
  const email = verified.email.toLowerCase();
  const avatar = verified.picture || undefined;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this Google account. Please register first.' });
    }
    if (!user.googleVerified) {
      user.googleVerified = true;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }
    res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Google authentication failed' });
  }
}
export async function emailExists(req, res) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('email role');
  res.json({ exists: !!user, role: user?.role || null });
}
export async function me(req, res) { res.json(await User.findById(req.user.id).select('-password')); }
