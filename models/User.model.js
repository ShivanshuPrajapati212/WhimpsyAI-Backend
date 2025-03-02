const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String
    },
    name:{
        type: String,
    },
    interests:[{ type: String }],
    learnedTopics:[
        { type: String, default: [] }
    ],
    xp:{
        type: Number,
        min: 0,
        default: 0
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
  });
  const User = mongoose.model('user', UserSchema);
  module.exports = User;