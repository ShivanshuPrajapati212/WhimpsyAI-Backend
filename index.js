const express = require("express");
const cors = require("cors")
require("dotenv").config()
const connectToMongo = require("./config/mongo.conf.js")
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');
const topicRoutes = require('./routes/topic.routes.js');
const { errorHandler } = require('./middleware/auth.middleware.js');
const session = require('express-session');
const configurePassport = require('./config/passport.conf.js'); // Add this line
connectToMongo();

const PORT = process.env.PORT || 5000

const app = express();

const passport = configurePassport();

app.use(cors({
    origin: ['http://localhost:5173', 'https://whimpsyai.vercel.app'],
    credentials: true
  }));
app.use(express.json())

app.set('trust proxy', 1); // Trust first proxy (required for secure cookies in production)
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'none',
  },
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res)=>{
    res.send("Welcome to Whimpsy AI")
})
app.get('/hello', (req, res)=>{
    res.send("Hello from WhimpsyAI's Backend")
})

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/topic', topicRoutes);
app.use(errorHandler);



app.listen(PORT, ()=> {
    console.log(`Server is running on PORT: ${PORT}`)
})