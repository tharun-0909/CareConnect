import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const user = new mongoose.Schema({ name: String, email: String, password: String, role: String });
const provider = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, name: String, initials: String, specialty: String, location: String, rating: Number, jobs: Number, verified: Boolean, isActive: Boolean, skills: [String], availability: String, accent: String });
const User = mongoose.model('User', user); const Provider = mongoose.model('Provider', provider);
await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careconnect');
await User.deleteMany({}); await Provider.deleteMany({});
const password = await bcrypt.hash('password123', 10);
await User.create({ name: 'Alex Morgan', email: 'alex@careconnect.local', role: 'admin', password });
const providerUsers = await User.create([
	{ name: 'Jordan Reed', email: 'jordan@careconnect.local', role: 'service_provider', password },
	{ name: 'Maya Lewis', email: 'maya@careconnect.local', role: 'service_provider', password },
	{ name: 'Dylan Nguyen', email: 'dylan@careconnect.local', role: 'service_provider', password }
]);
await Provider.insertMany([
	{ user: providerUsers[0]._id, name:'Jordan Reed', initials:'JR', specialty:'Appliance specialist', location:'North district', rating:4.9, jobs:128, verified:true, isActive:true, skills:['Appliance repair','Diagnostics'], availability:'Today' },
	{ user: providerUsers[1]._id, name:'Maya Lewis', initials:'ML', specialty:'Home cleaning', location:'Harbor district', rating:4.8, jobs:96, verified:true, isActive:true, skills:['Deep cleaning','Move-in'], availability:'Tomorrow' },
	{ user: providerUsers[2]._id, name:'Dylan Nguyen', initials:'DN', specialty:'Licensed electrician', location:'East district', rating:5, jobs:74, verified:true, isActive:true, skills:['Lighting','Wiring'], availability:'Today' }
]);
console.log('Seeded CareConnect. Admin and provider passwords: password123'); await mongoose.disconnect();
