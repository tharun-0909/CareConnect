import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true }, initials: String, specialty: String, location: String,
  serviceAreas: [String], skills: [String], documents: [String],
  rating: { type: Number, default: 0 }, jobs: { type: Number, default: 0 }, verified: { type: Boolean, default: false }, isActive: { type: Boolean, default: false },
  availability: { type: String, default: 'Available' }, accent: String
  ,locationCoordinates: { lat: Number, lng: Number }
}, { timestamps: true });

export default mongoose.model('Provider', providerSchema);
