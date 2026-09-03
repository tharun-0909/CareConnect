import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({ request: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true }, customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }, startsAt: { type: Date, required: true }, endsAt: { type: Date, required: true }, status: { type: String, enum: ['Scheduled', 'In progress', 'Completed', 'Cancelled'], default: 'Scheduled' }, notes: String, evidence: [String] }, { timestamps: true });
bookingSchema.index({ provider: 1, startsAt: 1, endsAt: 1 });
export default mongoose.model('Booking', bookingSchema);
