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
  latitude: { 
    type: Number,
    /* required: true, */
  },
  longitude: { 
    type: Number, 
    /* required: true  */
  },
  max_capacity: { 
    type: Number,
  },
  min_capacity: { 
    type: Number,
  },
  start_time: { 
    type: String,
  },
  end_time: { 
    type: String,
  },
  img_url: { 
    type: String,
    default: 'https://res.cloudinary.com/dhveca8ba/image/upload/v1689175401/dxbjiapytdozcg3qdoyw.jpg'
  },
  price: {
    type: Number,
    required: true,
    float: true
  },
  serviceReviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'review'
  }],
},
{ timestamps: false },
)

const serviceModel = mongoose.model('service', ServiceSchema)
module.exports = serviceModel