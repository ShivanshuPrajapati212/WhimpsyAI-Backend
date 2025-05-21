const { verifyToken, extractTokenFromRequest } = require('../helpers/jwt.helper');
const User = require('../models/User.model');

/**
 * JWT-based authentication middleware
 */
const isAuthenticated = async (req, res, next) => {
  try {
    // Extract token from request
    const token = extractTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token verification failed, authentication denied' });
    }

    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
};

module.exports = { errorHandler, isAuthenticated };