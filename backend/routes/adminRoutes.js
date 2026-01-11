const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getStats } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Protect all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

module.exports = router;
