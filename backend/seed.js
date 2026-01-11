require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skymemories');
        console.log('Connected to MongoDB');

        const defaultUser = {
            username: 'admin',
            email: 'admin@example.com',
            password: 'password1234'
        };

        // Check if user exists
        const existingUser = await User.findOne({ email: defaultUser.email });
        if (existingUser) {
            existingUser.password = defaultUser.password;
            await existingUser.save();
            console.log('Default user password updated to:', defaultUser.password);
        } else {
            const user = new User(defaultUser);
            await user.save();
            console.log('Default user created successfully');
        }

        console.log('Email:', defaultUser.email);
        console.log('Password:', defaultUser.password);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedUser();
