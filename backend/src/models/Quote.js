import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({ request: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true }, provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }, amount: { type: Number, required: true }, message: String, status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Expired'], default: 'Pending' } }, { timestamps: true });
export default mongoose.model('Quote', quoteSchema);
