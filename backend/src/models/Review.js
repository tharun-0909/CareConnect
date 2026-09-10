import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, trim: true },
  type: { type: String, enum: ['rating', 'comment'], default: 'comment' }
}, { timestamps: true });

reviewSchema.index({ request: 1, customer: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);