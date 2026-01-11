require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skymemories');

        const adminData = {
            username: 'superadmin',
            email: 'superadmin@example.com',
            password: 'password1234',
            role: 'admin'
        };

        // Delete if exists to force fresh creation
        await User.deleteOne({ email: adminData.email });

        const admin = new User(adminData);
        await admin.save();

        console.log('CREATED_SUCCESSFULLY');
        console.log('Email: ' + adminData.email);
        console.log('Password: ' + adminData.password);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createSuperAdmin();
