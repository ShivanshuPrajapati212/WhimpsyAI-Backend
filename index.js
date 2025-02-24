const express = require("express");
const cors = require("cors")
require("dotenv").config()
const connectToMongo = require("./lib/mongo.js")
const authRoutes = require('./routes/auth/auth.js');
const { errorHandler } = require('./middleware/authMiddleware.js');
const session = require('express-session');
const configurePassport = require('./config/passport.js'); // Add this line
connectToMongo();

const PORT = process.env.PORT || 5000

const app = express();

const passport = configurePassport();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(express.json())

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res)=>{
    res.send("Welcome to Whimpsy AI")
})

app.use('/api/auth', authRoutes);
app.use(errorHandler);



app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})