const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  first_name: { 
    type: String,
    required: true 
  },
  last_name: { 
    type: String,
  },
  email: { 
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String,
    required: true 
  },
  img_url: { 
    type: String,
    default: 'uploads/avatar.jpg'
  },
  role: {
    type: String
  }
},
{ timestamps: false },
)

const userModel = mongoose.model('user', UserSchema)
module.exports = userModel