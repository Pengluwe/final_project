const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    airline: {
        type: String,
        required: true,
    },
    flightNumber: {
        type: String,
        required: true,
    },
    departure: {
        type: String,
        required: true,
        uppercase: true,
        maxlength: 3,
    },
    destination: {
        type: String,
        required: true,
        uppercase: true,
        maxlength: 3,
    },
    date: {
        type: Date,
        required: true,
    },
    seatClass: {
        type: String,
        enum: ['Economy', 'Premium Economy', 'Business', 'First'],
        default: 'Economy',
    },
    notes: {
        type: String,
        default: '',
    },
    photos: [{
        type: String,
    }],
    aircraftReg: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

// Index for efficient retrieval of user's flights sorted by date
flightSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Flight', flightSchema);
