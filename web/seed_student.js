const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/school_management';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    avatar: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function main() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed admin user
    const adminPass = await bcrypt.hash('admin', 10);
    await User.findOneAndUpdate(
        { email: 'admin@school.com' },
        { name: 'Admin User', email: 'admin@school.com', password: adminPass, role: 'ADMIN' },
        { upsert: true, new: true }
    );
    console.log('Admin User Ready (admin@school.com / admin)');

    // Seed student user
    const studentPass = await bcrypt.hash('student', 10);
    await User.findOneAndUpdate(
        { email: 'student@school.edu' },
        { name: 'Student User', email: 'student@school.edu', password: studentPass, role: 'STUDENT' },
        { upsert: true, new: true }
    );
    console.log('Student User Ready (student@school.edu / student)');
}

main()
    .catch(console.error)
    .finally(() => mongoose.disconnect());
