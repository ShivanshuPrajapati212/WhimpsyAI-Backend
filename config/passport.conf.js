const passport = require('passport');
const Google = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../helpers/jwt.helper');

const configurePassport = () => {
  // JWT Strategy for API authentication
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  };
  
  passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id).select('-password');
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }));

  // Local Strategy for email/password login
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        
        // Return user without password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return done(null, userWithoutPassword);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // Google OAuth Strategy
  passport.use(new Google.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this email
        let user = await User.findOne({ email: profile.emails[0].value });
        
        // Create new user if not found
        if (!user) {
          user = await User.create({ 
            email: profile.emails[0].value,
            name: profile.displayName,
            // Add other default fields as needed
          });
        }
        
        // Return user without password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        done(null, userWithoutPassword);
      } catch (err) {
        done(err);
      }
    }
  ));

  return passport;
};

module.exports = { configurePassport };
