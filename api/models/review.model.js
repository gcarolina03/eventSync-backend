const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service',
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  thumb: {
    type: String,
    required: true
  }
},
{ timestamps: false },
)

ReviewSchema.index({ serviceId: 1, userId: 1 }, { unique: true });
const reviewModel = mongoose.model('review', ReviewSchema)
module.exports = reviewModel