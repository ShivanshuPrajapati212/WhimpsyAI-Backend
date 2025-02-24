const passport = require('passport');
const Google = require('passport-google-oauth20');
const Local = require('passport-local');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const configurePassport = () => {
passport.use(new Google.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await User.create({ 
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.use(new Local.Strategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Invalid credentials' });
    
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

return passport;
};

module.exports = configurePassport
