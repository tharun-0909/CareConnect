import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({ booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, openedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, reason: { type: String, required: true }, details: String, status: { type: String, enum: ['Open', 'Investigating', 'Resolved', 'Rejected'], default: 'Open' }, resolution: String }, { timestamps: true });
export default mongoose.model('Dispute', disputeSchema);
