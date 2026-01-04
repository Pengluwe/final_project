const Flight = require('../models/Flight');

// Get all flights for authenticated user
exports.getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(flights);
    } catch (error) {
        console.error('Get flights error:', error);
        res.status(500).json({ message: 'Server error fetching flights' });
    }
};

// Get single flight by ID
exports.getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        res.json(flight);
    } catch (error) {
        console.error('Get flight error:', error);
        res.status(500).json({ message: 'Server error fetching flight' });
    }
};

// Create new flight
exports.createFlight = async (req, res) => {
    try {
        const flightData = {
            ...req.body,
            userId: req.user._id,
        };

        const flight = new Flight(flightData);
        await flight.save();

        res.status(201).json(flight);
    } catch (error) {
        console.error('Create flight error:', error);
        res.status(500).json({ message: 'Server error creating flight' });
    }
};

// Update flight
exports.updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        res.json(flight);
    } catch (error) {
        console.error('Update flight error:', error);
        res.status(500).json({ message: 'Server error updating flight' });
    }
};

// Delete flight
exports.deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        res.json({ message: 'Flight deleted successfully' });
    } catch (error) {
        console.error('Delete flight error:', error);
        res.status(500).json({ message: 'Server error deleting flight' });
    }
};
