const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// GET /api/flights - Get all flights
router.get('/', flightController.getAllFlights);

// GET /api/flights/:id - Get single flight
router.get('/:id', flightController.getFlightById);

// POST /api/flights - Create new flight
router.post('/', flightController.createFlight);

// PUT /api/flights/:id - Update flight
router.put('/:id', flightController.updateFlight);

// DELETE /api/flights/:id - Delete flight
router.delete('/:id', flightController.deleteFlight);

module.exports = router;
