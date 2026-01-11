module.exports = (req, res, next) => {
    // Check if user exists and has admin role
    // Assumes authMiddleware has already run and populated req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};
