import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDatabase } from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const allowedOrigins = new Set([config.clientUrl, 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']);
app.use(cors({ origin: (origin, callback) => !origin || allowedOrigins.has(origin) ? callback(null, true) : callback(new Error('Origin not allowed by CareConnect API')) }));
app.use(express.json({ limit: '2mb' }));
app.get('/api/health', (_, res) => res.json({ ok: true, service: 'CareConnect API' }));
app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);

connectDatabase()
	.then(connected => app.listen(config.port, () => console.log(`CareConnect API running on ${config.port}${connected ? '' : ' without MongoDB'}`)))
	.catch(error => { console.error('MongoDB connection failed', error.message); process.exit(1); });
