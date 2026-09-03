import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
