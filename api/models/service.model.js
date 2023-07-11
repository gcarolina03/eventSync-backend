const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ServiceSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: { 
    type: String,
    required: true 
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  cityId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'city',
    required: true
  },
  max_capacity: { 
    type: Number,
  },
  min_capacity: { 
    type: Number,
  },
  img_url: { 
    type: String,
    default: 'uploads/services.jpg'
  },
  price: {
    type: Number,
    required: true,
    float: true
  }
},
{ timestamps: false },
)

const serviceModel = mongoose.model('service', ServiceSchema)
module.exports = serviceModel