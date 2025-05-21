const jwt = require('jsonwebtoken');

// Use environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'your_secure_jwt_secret_key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'; // 7 days by default

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object from database
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRY }
  );
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
};

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {String|null} - JWT token or null if not found
 */
const extractTokenFromRequest = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromRequest,
  JWT_SECRET
}; 