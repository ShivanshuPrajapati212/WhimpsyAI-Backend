const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({email: email});
    if (existingUser) {
      return res.status(400).json({message: "Email is already taken."});
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ email, password: hashedPassword });
    
    // Log in the user after signup
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      
      // Return user data without password
      const userData = newUser.toObject();
      delete userData.password;
      
      return res.status(201).json({ 
        message: 'User created successfully',
        user: userData
      });
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  const userData = req.user.toObject();
  delete userData.password;
  res.json(userData);
};

const logout = (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return res.status(500).json({ message: 'Logout failed' }); 
    }
    res.json({ message: 'Logged out successfully' });
  });
};

module.exports = {signup, getProfile, logout};