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
    username:{
        type: String,
    },
    interests:{
        type: Array
    }
  });
  const User = mongoose.model('user', UserSchema);
  module.exports = User;