import Review from '../models/Review.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Provider from '../models/Provider.js';

const populateOpts = [{ path: 'provider', select: 'name initials specialty' }, { path: 'customer', select: 'name email' }, { path: 'request', select: 'title category' }];

export async function listReviews(req, res) {
  let filter = {};
  if (req.user.role === 'admin') {
    if (req.query.provider) filter.provider = req.query.provider;
  } else if (req.user.role === 'service_provider') {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) return res.json([]);
    filter.provider = provider._id;
  } else if (req.user.role === 'customer') {
    filter.customer = req.user.id;
  }
  res.json(await Review.find(filter).populate(populateOpts).sort({ createdAt: -1 }));
}

export async function createReview(req, res) {
  const request = await ServiceRequest.findOne({ _id: req.body.requestId, customer: req.user.id, status: 'Completed' }).populate('provider');
  if (!request) return res.status(400).json({ message: 'You can only comment on a completed request you created' });
  if (!request.provider) return res.status(400).json({ message: 'No provider was assigned to this request' });
  const existing = await Review.findOne({ request: request._id, customer: req.user.id });
  if (existing) return res.status(409).json({ message: 'You have already commented on this request' });
  const review = await Review.create({
    request: request._id,
    customer: req.user.id,
    provider: request.provider._id,
    rating: Number(req.body.rating) || 5,
    comment: String(req.body.comment || '').trim(),
    type: 'comment'
  });
  const populated = await review.populate(populateOpts);
  res.status(201).json(populated);
}