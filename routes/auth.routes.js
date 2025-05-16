const express = require('express');
const passport = require('passport');
const { signup, getProfile, logout } = require("../controllers/auth.controller.js");
const { isAuthenticated } = require('../middleware/auth.middleware.js');

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Register a new user
router.post('/signup', signup);

// Local login with session
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in successfully', user: req.user });
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: true
}));

// Google callback with session
router.get('/google/callback', 
  passport.authenticate('google', { 
    session: true,
    successRedirect: `${FRONTEND_URL}/dashboard`,
    failureRedirect: `${FRONTEND_URL}/login` 
  })
);

// Get user profile - protected by session auth
router.get('/profile', isAuthenticated, getProfile);

// Logout endpoint
router.post('/logout', logout);

module.exports = router;
