import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['admin', 'customer', 'service_provider'], default: 'customer' },
  avatar: String,
  googleVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
