
const express = require('express');
const passport = require('passport');
const { signup, getProfile, logout } = require("../controllers/auth.controller.js");
const { isAuthenticated } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in', user: req.user });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { successRedirect:"http://localhost:5173/onboarding",
    failureRedirect:"http://localhost:5173/login" }),
  (req, res) => res.redirect('/profile')
);

router.get('/profile', isAuthenticated, getProfile);
router.post('/logout', logout);

module.exports = router;