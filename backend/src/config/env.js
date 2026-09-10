import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(directory, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  googleClientId: process.env.GOOGLE_CLIENT_ID || ''
};
