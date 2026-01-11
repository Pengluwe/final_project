const Airport = require('../models/Airport');

// Get all airports (sorted by code)
exports.getAllAirports = async (req, res) => {
    try {
        const airports = await Airport.find().sort({ code: 1 });
        res.json(airports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get airport by IATA code
exports.getAirportByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const airport = await Airport.findOne({ code: code.toUpperCase() });

        if (!airport) {
            return res.status(404).json({ message: 'Airport not found' });
        }

        res.json(airport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get multiple airports by codes (for map optimization)
exports.getAirportsByCodes = async (req, res) => {
    try {
        const { codes } = req.body; // Expect array of strings e.g., ["TPE", "NRT"]
        if (!codes || !Array.isArray(codes)) {
            return res.status(400).json({ message: 'Please provide an array of airport codes' });
        }

        const airports = await Airport.find({ code: { $in: codes.map(c => c.toUpperCase()) } });
        res.json(airports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Search airports (optional for future autocomplete)
exports.searchAirports = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const airports = await Airport.find({
            $or: [
                { code: { $regex: query, $options: 'i' } },
                { city: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } }
            ]
        }).limit(10);

        res.json(airports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
