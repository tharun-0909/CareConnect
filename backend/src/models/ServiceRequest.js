import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, description: String, category: { type: String, required: true },
  address: { type: String, required: true }, urgency: { type: String, default: 'Flexible' },
  status: { type: String, enum: ['New', 'Matching', 'Quoted', 'Scheduled', 'In progress', 'Completed', 'Cancelled'], default: 'New' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  customerLocation: { lat: Number, lng: Number },
  quotes: { type: Number, default: 0 }, scheduledAt: Date
}, { timestamps: true });

export default mongoose.model('ServiceRequest', serviceRequestSchema);
