const jwt = require('jsonwebtoken');
const ApiError = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel'); // Adjust the path if needed

const auth = asyncHandler(async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        // Check if token exists
        if (!token) {
            throw new ApiError(401, 'Authentication required');
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by id
        const user = await User.findById(decoded._id);
        
        if (!user) {
            throw new ApiError(401, 'User not found');
        }
        
        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, 'Invalid token');
        }
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Token expired');
        }
        throw error;
    }
});

module.exports = auth; 