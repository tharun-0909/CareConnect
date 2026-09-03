import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careconnect');
const mappings = { user: 'customer', customer: 'customer', operations: 'customer', operation: 'customer', operation_manager: 'customer', provider: 'service_provider', providers: 'service_provider', service_provider: 'service_provider', support: 'customer', support_agent: 'customer' };
for (const [oldRole, newRole] of Object.entries(mappings)) { const result = await User.updateMany({ role: oldRole }, { $set: { role: newRole } }); console.log(`${oldRole} -> ${newRole}: ${result.modifiedCount} users`); }
await mongoose.disconnect();
