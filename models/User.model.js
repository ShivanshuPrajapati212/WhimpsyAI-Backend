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
    learnedTopics:[{ type: String }],
    xp:{
        type: Number,
        min: 0,
        default: 0
    }
  });
  const User = mongoose.model('user', UserSchema);
  module.exports = User;