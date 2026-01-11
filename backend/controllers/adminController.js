const User = require('../models/User');
const Flight = require('../models/Flight');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user and their data
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting self (optional but good practice)
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }

        // Delete user's flights
        await Flight.deleteMany({ userId: user._id });

        // Delete user
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and all associated data deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get system stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalFlights = await Flight.countDocuments();
        res.json({ totalUsers, totalFlights });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
