import Notification from '../models/Notification.js';
import Provider from '../models/Provider.js';
import ServiceRequest from '../models/ServiceRequest.js';

export async function listMyNotifications(req, res) {
  let provider = await Provider.findOne({ user: req.user.id });
  if (!provider) { provider = await Provider.findOne({ name: req.user.name }); if (provider) { provider.user = req.user.id; await provider.save(); } }
  if (!provider) return res.json([]);
  res.json(await Notification.find({ provider: provider._id, status: 'pending' }).populate({ path: 'request', populate: { path: 'customer', select: 'name email' } }).sort({ createdAt: -1 }));
}

export async function acceptNotification(req, res) {
  let provider = await Provider.findOne({ user: req.user.id });
  if (!provider) { provider = await Provider.findOne({ name: req.user.name }); if (provider) { provider.user = req.user.id; await provider.save(); } }
  if (!provider) return res.status(404).json({ message: 'Provider profile not found for this account' });
  const notification = await Notification.findOne({ _id: req.params.id, provider: provider._id, status: 'pending' });
  if (!notification) return res.status(404).json({ message: 'Notification is no longer available' });
  const request = await ServiceRequest.findOne({ _id: notification.request, provider: { $exists: false }, status: 'Matching' });
  if (!request) return res.status(409).json({ message: 'This request has already been accepted' });
  request.provider = provider._id;
  request.status = 'Scheduled';
  await request.save();
  await Notification.updateMany({ request: request._id, status: 'pending' }, { status: 'declined' });
  notification.status = 'accepted';
  await notification.save();
  res.json(await request.populate('provider', 'name initials rating specialty location'));
}

export async function rejectNotification(req, res) {
  const provider = await Provider.findOne({ user: req.user.id });
  if (!provider) return res.status(404).json({ message: 'Provider profile not found for this account' });
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, provider: provider._id, status: 'pending' }, { status: 'declined' }, { new: true });
  if (!notification) return res.status(404).json({ message: 'Notification is no longer available' });
  res.json({ message: 'Request rejected' });
}
