const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  event_date: { 
    type: Date,
  },
  start_time: { 
    type: String,
  },
  end_time: { 
    type: String,
  },
  total_price: { 
    type: Number,
    float: true,
    default: 0
  },
  img_url: { 
    type: String,
    default: 'uploads/location.jpg'
  },
},
{ timestamps: false },
)

const eventModel = mongoose.model('event', EventSchema)
module.exports = eventModel