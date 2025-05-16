const passport = require('passport');
const Google = require('passport-google-oauth20');
const Local = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');

// JWT secret key - use environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const configurePassport = () => {
  // JWT Strategy
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  };
  
  passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }));

  // Google OAuth Strategy
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
      console.log('Deserialized User:', user); // Log the user object
      if (!user) {
        return done(null, false); // User not found
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  return passport;
};

module.exports = { configurePassport, JWT_SECRET };
