import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase() {
  if (!config.mongoUri) throw new Error('MONGO_URI is missing. Add it to backend/.env.');
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
  return mongoose.connection.readyState === 1;
}
