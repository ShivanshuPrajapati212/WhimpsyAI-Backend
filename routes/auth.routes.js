const express = require('express');
const passport = require('passport');
const { signup, login, socialAuthCallback, getProfile, logout } = require("../controllers/auth.controller.js");
const { isAuthenticated } = require('../middleware/auth.middleware.js');

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Register a new user
router.post('/signup', signup);

// Login with email/password
router.post('/login', login);

// Google OAuth routes - we still use passport for OAuth but then convert to JWT
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email']
}));

// Google callback - after successful auth, generate JWT token and redirect
router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false, // Don't create session for OAuth
    failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed` 
  }),
  socialAuthCallback
);

// Get user profile - protected by JWT middleware
router.get('/profile', isAuthenticated, getProfile);

// Logout endpoint
router.post('/logout', logout);

module.exports = router;
