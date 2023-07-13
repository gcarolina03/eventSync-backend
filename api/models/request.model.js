const mongoose = require('mongoose')
const Schema = mongoose.Schema

const getDate = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')

  return year + month + day
}

const RequestSchema = new Schema({
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service',
    required: true
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  state: {
    type: String,
    required: true,
    default: 'pending'
  },
  date_of_request: {
    type: String,
    required: true,
    default: getDate()
  }
},
{ 
  timestamps: false
})

RequestSchema.index({ serviceId: 1, eventId: 1 }, { unique: true });
const requestModel = mongoose.model('request', RequestSchema)
module.exports = requestModel