import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({ name: { type: String, required: true, unique: true }, description: String, icon: String, active: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.model('Category', categorySchema);
