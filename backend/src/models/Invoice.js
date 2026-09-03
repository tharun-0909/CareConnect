import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({ booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }, amount: Number, status: { type: String, enum: ['Draft', 'Issued', 'Paid', 'Refunded'], default: 'Draft' }, dueAt: Date }, { timestamps: true });
export default mongoose.model('Invoice', invoiceSchema);
