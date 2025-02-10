const mongoose = require('mongoose')
const Schema = mongoose.Schema
// Custom setter function to capitalize the first letter
const toLowercase = (value) => {
  return value.toLowerCase();
}

// Custom setter function to capitalize the first letter
const capitalizeWords = value => (
  value.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
)

const UserSchema = new Schema({
  first_name: { 
    type: String,
    required: true,
    set: capitalizeWords
  },
  last_name: { 
    type: String,
    set: capitalizeWords
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    set: toLowercase
  },
  password: { 
    type: String,
    required: true 
  },
  img_url: { 
    type: String,
    default: 'https://res.cloudinary.com/dhveca8ba/image/upload/v1689175163/jvpcce9vmgjqjzqcc8ec.jpg'
  },
  eventsCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event'
  }],
  servicesCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service'
  }],
  role: {
    type: String,
    default: 'user'
  }
},
{ timestamps: false },
)

const userModel = mongoose.model('user', UserSchema)

module.exports = userModel