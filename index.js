const express = require("express");
const cors = require("cors")
require("dotenv").config()

const connectToMongo = require("./lib/mongo.js")

connectToMongo();

const PORT = process.env.PORT || 5000

const app = express();
app.use(cors())
app.use(express.json())


app.get('/', (req, res)=>{
    res.send("Welcome to Whimpsy AI")
})

app.use("/auth", require("./routes/auth/auth.js"))



app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})