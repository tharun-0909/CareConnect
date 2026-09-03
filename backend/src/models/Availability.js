import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({ provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }, startsAt: { type: Date, required: true }, endsAt: { type: Date, required: true }, status: { type: String, enum: ['Available', 'Blocked'], default: 'Available' } }, { timestamps: true });
availabilitySchema.index({ provider: 1, startsAt: 1, endsAt: 1 });
export default mongoose.model('Availability', availabilitySchema);
