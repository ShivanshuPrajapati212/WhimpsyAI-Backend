const mongoose = require("mongoose")

const MONGO_URI = process.env.MONGO_URI;

const connectToMongo = () => {
mongoose.connect(MONGO_URI)

.then(
    console.log("Connected to MongoDB Database")
).catch((e)=>{
    console.log("error occured while conecting to mongodb : ", e)
})
}
module.exports = connectToMongo