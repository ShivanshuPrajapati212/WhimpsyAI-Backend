const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt.helper');

/**
 * Register a new user and return JWT token
 */
const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken." });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ email, password: hashedPassword });
    
    // Generate JWT token
    const token = generateToken(newUser);
    
    // Return user data and token
    const userData = newUser.toObject();
    delete userData.password;
    
    return res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: userData
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login user with email and password
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data and token
    const userData = user.toObject();
    delete userData.password;
    
    return res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle social authentication callback and return JWT token
 */
const socialAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=authentication_failed`);
    }
    
    // Generate token for social user
    const token = generateToken(req.user);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth-callback?token=${token}`);
  } catch (err) {
    console.error('Social auth callback error:', err);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=authentication_failed`);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    // User is already attached to req by the isAuthenticated middleware
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Logout is handled client-side by removing the token
 */
const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = { signup, login, socialAuthCallback, getProfile, logout };