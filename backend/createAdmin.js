require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skymemories');
        console.log('Connected to MongoDB');

        const adminData = {
            username: 'admin',
            email: 'admin@example.com',
            password: 'password1234',
            role: 'admin'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            // Update role just in case
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Updated existing admin user role');
        } else {
            const admin = new User(adminData);
            await admin.save();
            console.log('Created new admin user');
        }

        console.log('Admin Credentials:');
        console.log('Email: admin@example.com');
        console.log('Password: password1234');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
