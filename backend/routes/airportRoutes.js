const express = require('express');
const router = express.Router();
const { getAirportByCode, getAirportsByCodes, searchAirports, getAllAirports } = require('../controllers/airportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllAirports);
router.get('/search', authMiddleware, searchAirports);
router.post('/batch', authMiddleware, getAirportsByCodes);
router.get('/:code', authMiddleware, getAirportByCode);

module.exports = router;
