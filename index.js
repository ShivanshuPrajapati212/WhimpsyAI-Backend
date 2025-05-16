const express = require("express");
const cors = require("cors")
require("dotenv").config()
const connectToMongo = require("./config/mongo.conf.js")
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');
const topicRoutes = require('./routes/topic.routes.js');
const { errorHandler } = require('./middleware/auth.middleware.js');
const session = require('cookie-session');
const { configurePassport } = require('./config/passport.conf.js');
const passport = require('passport');

connectToMongo();

const PORT = process.env.PORT || 5000;
const app = express();

// Configure Passport
const passportInstance = configurePassport();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://whimpsyai.vercel.app'],
  credentials: true
}));

// Parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust first proxy for secure cookies in production
app.set('trust proxy', 1);

// Session setup
app.use(session({
  name: 'whimpsyai-session',
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport
app.use(passport.initialize());

// Sessions only used for social auth flow
app.use(passport.session());

// Basic routes
app.get('/', (req, res) => {
  res.send("Welcome to Whimpsy AI");
});

app.get('/hello', (req, res) => {
  res.send("Hello from WhimpsyAI's Backend");
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/topic', topicRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});