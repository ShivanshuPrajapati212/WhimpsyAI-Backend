const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExist = User.findOne({email: email})

    if(userExist._id){
      return res.status(400).json({error: "Email is already taken."})
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword });
    return res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    next(err);
  }
};

const getProfile = (req, res) => {
  console.log('User:', req.user);
  console.log('Session:', req.session);
  res.json(req.user);
};

const logout = (req, res) => {
  req.logout();
  res.json({ message: 'Logged out' });
};

module.exports = {signup, getProfile, logout}